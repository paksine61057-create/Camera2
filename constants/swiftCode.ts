
import { SwiftFile } from '../types';

export const SWIFT_PROJECT: SwiftFile[] = [
  {
    name: "CameraService.swift",
    content: `import AVFoundation
import Combine

/// Core Service managing the AVFoundation capture session
class CameraService: ObservableObject {
    @Published var session = AVCaptureSession()
    @Published var error: Error?
    
    private let sessionQueue = DispatchQueue(label: "com.floatingcamera.sessionQueue")
    
    init() {
        checkPermissions()
    }
    
    private func checkPermissions() {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            setupSession()
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
                if granted { self?.setupSession() }
            }
        default:
            break
        }
    }
    
    private func setupSession() {
        sessionQueue.async { [weak self] in
            guard let self = self else { return }
            self.session.beginConfiguration()
            
            // iPad-specific optimization for camera
            guard let videoDevice = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front),
                  let videoDeviceInput = try? AVCaptureDeviceInput(device: videoDevice),
                  self.session.canAddInput(videoDeviceInput) else { return }
            
            self.session.addInput(videoDeviceInput)
            self.session.commitConfiguration()
            self.session.startRunning()
        }
    }
}`
  },
  {
    name: "CameraPreviewView.swift",
    content: `import SwiftUI
import AVFoundation

/// UIViewRepresentable bridge for showing the AVCaptureVideoPreviewLayer
struct CameraPreviewView: UIViewRepresentable {
    let session: AVCaptureSession
    
    class VideoPreviewView: UIView {
        override class var layerClass: AnyClass {
            AVCaptureVideoPreviewLayer.self
        }
        
        var videoPreviewLayer: AVCaptureVideoPreviewLayer {
            return layer as! AVCaptureVideoPreviewLayer
        }
    }
    
    func makeUIView(context: Context) -> VideoPreviewView {
        let view = VideoPreviewView()
        view.backgroundColor = .black
        view.videoPreviewLayer.session = session
        view.videoPreviewLayer.videoGravity = .resizeAspectFill
        view.videoPreviewLayer.connection?.videoOrientation = .landscapeRight // Adjust for iPad Orientation
        return view
    }
    
    func updateUIView(_ uiView: VideoPreviewView, context: Context) {}
}`
  },
  {
    name: "FloatingCameraWindow.swift",
    content: `import SwiftUI

enum BGStyle {
    case color, blur, gradient
}

struct FloatingCameraWindow: View {
    @StateObject private var cameraService = CameraService()
    @State private var offset: CGSize = .zero
    @State private var currentPosition: CGSize = .zero
    @State var style: BGStyle = .blur
    
    // Limits the window within the iPad display bounds
    private let windowSize = CGSize(width: 320, height: 200)
    
    var body: some View {
        ZStack {
            // Main Window Container
            VStack(spacing: 0) {
                // Drag Handle / Header
                HStack {
                    Circle().fill(Color.red).frame(width: 8, height: 8)
                    Text("Live Camera").font(.caption).bold()
                    Spacer()
                    Image(systemName: "line.3.horizontal").font(.caption)
                }
                .padding(.horizontal, 12)
                .frame(height: 32)
                .background(Color.black.opacity(0.3))
                
                // Camera View Subview
                CameraPreviewView(session: cameraService.session)
                    .cornerRadius(12)
                    .padding(8)
            }
            .frame(width: windowSize.width, height: windowSize.height)
            .background(backgroundView)
            .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
            .shadow(color: .black.opacity(0.4), radius: 20, x: 0, y: 10)
            .offset(x: offset.width + currentPosition.width, y: offset.height + currentPosition.height)
            .gesture(
                DragGesture()
                    .onChanged { value in
                        offset = value.translation
                    }
                    .onEnded { value in
                        currentPosition.width += value.translation.width
                        currentPosition.height += value.translation.height
                        offset = .zero
                    }
            )
        }
    }
    
    @ViewBuilder
    private var backgroundView: some View {
        switch style {
        case .color:
            Color.gray.opacity(0.9)
        case .blur:
            VisualEffectBlur(blurStyle: .systemUltraThinMaterialDark)
        case .gradient:
            LinearGradient(colors: [.purple, .blue], startPoint: .topLeading, endPoint: .bottomTrailing)
        }
    }
}

// Helper for UIBlurEffect in SwiftUI
struct VisualEffectBlur: UIViewRepresentable {
    var blurStyle: UIBlurEffect.Style
    func makeUIView(context: Context) -> UIVisualEffectView {
        UIVisualEffectView(effect: UIBlurEffect(style: blurStyle))
    }
    func updateUIView(_ uiView: UIVisualEffectView, context: Context) {}
}`
  }
];
