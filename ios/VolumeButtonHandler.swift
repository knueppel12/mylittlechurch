import Foundation
import MediaPlayer
import AVFoundation
import React
import UIKit

@objc(VolumeButtonHandler)
class VolumeButtonHandler: RCTEventEmitter {

  private let audioSession = AVAudioSession.sharedInstance()
  
  // Minimal über 0, damit sowohl Volume+ als auch Volume− Events erzeugen können
  private let minVolume: Float = 0.06
  private let maxVolume: Float = 0.94
  
  private var initialVolume: Float = 0.06
  private var volumeView: MPVolumeView?
  
  // Flag, um zu unterscheiden, ob wir selbst die Lautstärke ändern
  private var isAdjustingVolumeProgrammatically = false

  override init() {
    super.init()
    setup()
  }

  private func setup() {
    do {
      try audioSession.setActive(true, options: [])
      
      // Aktuelle Lautstärke holen und in einen sicheren Bereich clampen
      let current = audioSession.outputVolume
      let clamped = max(min(current, maxVolume), minVolume)
      initialVolume = clamped
      
      // Falls iOS gerade auf 0 oder extrem niedrig steht → einmalig auf minVolume setzen
      if current < minVolume {
        initialVolume = minVolume
        setVolume(minVolume)
      }
    } catch {
      print("Error activating audio session: \(error)")
    }

    // Versteckte MPVolumeView, damit das iOS-Lautstärke-Overlay nicht sichtbar wird
    let vv = MPVolumeView(frame: .zero)
    vv.isHidden = true
    volumeView = vv

    if let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
       let window = scene.windows.first {
      window.addSubview(vv)
    }

    // KVO auf outputVolume
    audioSession.addObserver(self,
                             forKeyPath: "outputVolume",
                             options: [.old, .new],
                             context: nil)
  }

  // React Native Boilerplate
  override class func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func supportedEvents() -> [String]! {
    return ["onVolumeButtonPress"]
  }

  // KVO-Callback: Wird aufgerufen, wenn sich outputVolume ändert
  override func observeValue(forKeyPath keyPath: String?,
                             of object: Any?,
                             change: [NSKeyValueChangeKey : Any]?,
                             context: UnsafeMutableRawPointer?) {

    guard keyPath == "outputVolume" else { return }

    // Wenn wir selbst gerade die Lautstärke zurücksetzen, Event ignorieren
    if isAdjustingVolumeProgrammatically {
      return
    }

    // Event nach React Native schicken → dort löst das dann handleCapture() aus
    sendEvent(withName: "onVolumeButtonPress", body: nil)

    // Volume sofort wieder auf initialVolume zurücksetzen
    resetVolumeToInitial()
  }

  private func resetVolumeToInitial() {
    // Sicherheitshalber initialVolume nochmal clampen
    initialVolume = max(min(initialVolume, maxVolume), minVolume)
    setVolume(initialVolume)
  }

  private func setVolume(_ volume: Float) {
    guard let volumeView = volumeView else { return }

    isAdjustingVolumeProgrammatically = true
    defer {
      // Nach einem kurzen Tick zurücksetzen, damit wir zukünftige Tastendrücke wieder erkennen
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) { [weak self] in
        self?.isAdjustingVolumeProgrammatically = false
      }
    }

    for subview in volumeView.subviews {
      if let slider = subview as? UISlider {
        slider.setValue(volume, animated: false)
        slider.sendActions(for: .valueChanged)
        break
      }
    }
  }

  deinit {
    audioSession.removeObserver(self, forKeyPath: "outputVolume")
  }
}
