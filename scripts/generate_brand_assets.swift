#!/usr/bin/swift

import AppKit
import Foundation

struct OGSpec {
    let filename: String
    let title: String
    let subtitle: String
    let badge: String?
}

let fileManager = FileManager.default
let projectRoot = URL(fileURLWithPath: fileManager.currentDirectoryPath)
let publicDir = projectRoot.appendingPathComponent("public", isDirectory: true)
let imagesDir = publicDir.appendingPathComponent("images", isDirectory: true)

@discardableResult
func ensureDirectory(_ url: URL) throws -> URL {
    try fileManager.createDirectory(at: url, withIntermediateDirectories: true, attributes: nil)
    return url
}

let ogSpecs: [OGSpec] = [
    OGSpec(
        filename: "og-image.png",
        title: "Plan Tomorrow Tonight, Wake Up Ready to Execute",
        subtitle: "The evening planning app that transforms chaotic mornings",
        badge: "Join 10,000+ productive professionals"
    ),
    OGSpec(
        filename: "og-pricing.png",
        title: "Start Free, Upgrade When Ready",
        subtitle: "$0 - $4.99/mo - $99 Lifetime. 80% cheaper than Sunsama",
        badge: "No credit card required"
    ),
    OGSpec(
        filename: "og-about.png",
        title: "The Science of Evening Planning",
        subtitle: "73% reduction in morning decision fatigue. Built by people who get it",
        badge: "Domani Research Lab"
    ),
    OGSpec(
        filename: "og-faq.png",
        title: "Everything About Evening Planning",
        subtitle: "Methods - Features - Pricing - Privacy",
        badge: "Get your questions answered"
    ),
    OGSpec(
        filename: "twitter-image.png",
        title: "Plan Tomorrow Tonight, Wake Up Ready to Execute",
        subtitle: "The evening planning app that transforms chaotic mornings",
        badge: "Follow Domani for launch"
    )
]

let backgroundStart = NSColor(calibratedRed: 0.36, green: 0.18, blue: 0.67, alpha: 1.0)
let backgroundEnd = NSColor(calibratedRed: 0.11, green: 0.47, blue: 0.91, alpha: 1.0)

enum AssetError: Error {
    case contextCreationFailed
    case exportFailed
}

func makeContext(width: Int, height: Int) -> CGContext? {
    CGContext(
        data: nil,
        width: width,
        height: height,
        bitsPerComponent: 8,
        bytesPerRow: 0,
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
    )
}

func savePNG(from context: CGContext, to url: URL) throws {
    guard let image = context.makeImage() else {
        throw AssetError.exportFailed
    }
    let bitmap = NSBitmapImageRep(cgImage: image)
    guard let data = bitmap.representation(using: .png, properties: [:]) else {
        throw AssetError.exportFailed
    }
    try data.write(to: url)
}

func drawGradientBackground(in context: CGContext, size: CGSize) {
    context.saveGState()
    context.setFillColor(backgroundEnd.cgColor)
    context.fill(CGRect(origin: .zero, size: size))
    if let gradient = CGGradient(
        colorsSpace: CGColorSpaceCreateDeviceRGB(),
        colors: [backgroundStart.cgColor, backgroundEnd.cgColor] as CFArray,
        locations: [0.0, 1.0]
    ) {
        context.drawLinearGradient(
            gradient,
            start: CGPoint(x: 0, y: size.height),
            end: CGPoint(x: size.width, y: 0),
            options: []
        )
    }
    context.restoreGState()
}

func drawPanel(in context: CGContext, rect: CGRect) {
    context.saveGState()
    let path = CGPath(roundedRect: rect, cornerWidth: 36, cornerHeight: 36, transform: nil)
    context.addPath(path)
    context.setFillColor(NSColor(calibratedWhite: 1.0, alpha: 0.08).cgColor)
    context.fillPath()
    context.restoreGState()
}

func textAttributes(fontSize: CGFloat, weight: NSFont.Weight, color: NSColor, alignment: NSTextAlignment = .left) -> [NSAttributedString.Key: Any] {
    let font = NSFont.systemFont(ofSize: fontSize, weight: weight)
    let paragraph = NSMutableParagraphStyle()
    paragraph.lineBreakMode = .byWordWrapping
    paragraph.lineSpacing = font.pointSize * 0.12
    paragraph.alignment = alignment
    return [
        .font: font,
        .foregroundColor: color,
        .paragraphStyle: paragraph
    ]
}

@discardableResult
func drawText(_ text: String, attributes: [NSAttributedString.Key: Any], origin: CGPoint, maxWidth: CGFloat) -> CGFloat {
    let attributedString = NSAttributedString(string: text, attributes: attributes)
    let bounding = attributedString.boundingRect(
        with: NSSize(width: maxWidth, height: .greatestFiniteMagnitude),
        options: [.usesLineFragmentOrigin, .usesFontLeading]
    )
    let height = ceil(bounding.height)
    let frame = CGRect(x: origin.x, y: origin.y - height, width: maxWidth, height: height)
    attributedString.draw(in: frame)
    return height
}

func drawBadge(text: String, origin: CGPoint, maxWidth: CGFloat) -> CGFloat {
    let attributes = textAttributes(fontSize: 24, weight: .semibold, color: .white, alignment: .left)
    let attributed = NSAttributedString(string: text.uppercased(), attributes: attributes)
    let bounding = attributed.boundingRect(
        with: NSSize(width: maxWidth, height: 60),
        options: [.usesLineFragmentOrigin, .usesFontLeading]
    )
    let padding = CGSize(width: 28, height: 12)
    let badgeSize = CGSize(width: ceil(bounding.width) + padding.width * 2, height: ceil(bounding.height) + padding.height * 2)
    let rect = CGRect(x: origin.x, y: origin.y - badgeSize.height, width: badgeSize.width, height: badgeSize.height)

    if let context = NSGraphicsContext.current?.cgContext {
        context.saveGState()
        let path = CGPath(roundedRect: rect, cornerWidth: badgeSize.height / 2, cornerHeight: badgeSize.height / 2, transform: nil)
        context.addPath(path)
        context.setFillColor(NSColor(calibratedWhite: 1.0, alpha: 0.2).cgColor)
        context.fillPath()
        context.restoreGState()
    }

    let textRect = CGRect(
        x: rect.origin.x + padding.width,
        y: rect.origin.y + (padding.height / 2),
        width: rect.width - padding.width * 2,
        height: rect.height - padding.height
    )
    attributed.draw(in: textRect)
    return badgeSize.height
}

func generateOGImages() throws {
    try ensureDirectory(publicDir)
    try ensureDirectory(imagesDir)

    for spec in ogSpecs {
        guard let context = makeContext(width: 1200, height: 630) else {
            throw AssetError.contextCreationFailed
        }
        let graphicsContext = NSGraphicsContext(cgContext: context, flipped: false)
        NSGraphicsContext.current = graphicsContext
        defer { NSGraphicsContext.current = nil }
        let canvasSize = CGSize(width: 1200, height: 630)

        drawGradientBackground(in: context, size: canvasSize)
        drawPanel(in: context, rect: CGRect(x: 64, y: 64, width: canvasSize.width - 128, height: canvasSize.height - 128))

        let textWidth = canvasSize.width - 160
        var cursorY = canvasSize.height - 80
        let xOrigin: CGFloat = 96

        if let badge = spec.badge {
            let badgeHeight = drawBadge(text: badge, origin: CGPoint(x: xOrigin, y: cursorY), maxWidth: textWidth)
            cursorY -= badgeHeight + 28
        }

        let titleAttributes = textAttributes(fontSize: 66, weight: .bold, color: .white)
        let subtitleAttributes = textAttributes(fontSize: 34, weight: .medium, color: NSColor(calibratedWhite: 0.95, alpha: 1.0))

        let titleHeight = drawText(spec.title, attributes: titleAttributes, origin: CGPoint(x: xOrigin, y: cursorY), maxWidth: textWidth)
        cursorY -= titleHeight + 28
        _ = drawText(spec.subtitle, attributes: subtitleAttributes, origin: CGPoint(x: xOrigin, y: cursorY), maxWidth: textWidth)

        let outputURL = publicDir.appendingPathComponent(spec.filename)
        try savePNG(from: context, to: outputURL)
    }
}

func drawLogo(size: Int, outputURL: URL) throws {
    guard let context = makeContext(width: size, height: size) else {
        throw AssetError.contextCreationFailed
    }
    let graphicsContext = NSGraphicsContext(cgContext: context, flipped: false)
    NSGraphicsContext.current = graphicsContext
    defer { NSGraphicsContext.current = nil }
    let canvas = CGSize(width: CGFloat(size), height: CGFloat(size))
    drawGradientBackground(in: context, size: canvas)

    let circleRect = CGRect(x: canvas.width * 0.08, y: canvas.height * 0.08, width: canvas.width * 0.84, height: canvas.height * 0.84)
    context.saveGState()
    context.setFillColor(NSColor(calibratedWhite: 1.0, alpha: 0.12).cgColor)
    context.fillEllipse(in: circleRect)
    context.setStrokeColor(NSColor(calibratedWhite: 1.0, alpha: 0.35).cgColor)
    context.setLineWidth(canvas.width * 0.02)
    context.strokeEllipse(in: circleRect)
    context.restoreGState()

    let glyphAttributes = textAttributes(fontSize: canvas.width * 0.42, weight: .heavy, color: .white, alignment: .center)
    let glyph = NSAttributedString(string: "D", attributes: glyphAttributes)
    let bounding = glyph.boundingRect(with: canvas, options: [.usesLineFragmentOrigin, .usesFontLeading])
    let drawRect = CGRect(
        x: (canvas.width - bounding.width) / 2,
        y: (canvas.height - bounding.height) / 2,
        width: bounding.width,
        height: bounding.height
    )
    glyph.draw(in: drawRect)

    try savePNG(from: context, to: outputURL)
}

func writeFavicon(from pngURL: URL, size: UInt8, destination: URL) throws {
    let pngData = try Data(contentsOf: pngURL)
    var icoData = Data()
    icoData.append(contentsOf: [0x00, 0x00]) // reserved
    icoData.append(contentsOf: [0x01, 0x00]) // icon type
    icoData.append(contentsOf: [0x01, 0x00]) // image count
    icoData.append(size)
    icoData.append(size)
    icoData.append(contentsOf: [0x00, 0x00]) // color count & reserved

    func appendLittleEndian<T: FixedWidthInteger>(_ value: T) {
        var le = value.littleEndian
        withUnsafeBytes(of: &le) { ptr in
            icoData.append(contentsOf: ptr)
        }
    }

    appendLittleEndian(UInt16(1)) // color planes
    appendLittleEndian(UInt16(32)) // bit count
    appendLittleEndian(UInt32(pngData.count))
    appendLittleEndian(UInt32(6 + 16)) // header + entry
    icoData.append(pngData)
    try icoData.write(to: destination)
}

func generateLogoAssets() throws {
    try ensureDirectory(publicDir)
    let logoURL = publicDir.appendingPathComponent("logo.png")
    let logo192URL = publicDir.appendingPathComponent("logo-192.png")
    let appleIconURL = publicDir.appendingPathComponent("apple-touch-icon.png")
    let favicon32URL = publicDir.appendingPathComponent("favicon-32x32.png")
    let favicon16URL = publicDir.appendingPathComponent("favicon-16x16.png")

    try drawLogo(size: 512, outputURL: logoURL)
    try drawLogo(size: 192, outputURL: logo192URL)
    try drawLogo(size: 180, outputURL: appleIconURL)
    try drawLogo(size: 32, outputURL: favicon32URL)
    try drawLogo(size: 16, outputURL: favicon16URL)

    let faviconURL = publicDir.appendingPathComponent("favicon.ico")
    try writeFavicon(from: favicon32URL, size: 32, destination: faviconURL)
}

do {
    try generateOGImages()
    try generateLogoAssets()
} catch {
    FileHandle.standardError.write(Data("Asset generation failed: \\(error)\\n".utf8))
    exit(1)
}
