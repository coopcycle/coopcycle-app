//
//  UIImage+Additions.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 1/17/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

internal extension UIImage {

    func grayscale() -> UIImage? {
        if let currentFilter = CIFilter(name: "CIPhotoEffectMono") {
            let context = CIContext(options: nil)
            currentFilter.setValue(CIImage(image: self), forKey: kCIInputImageKey)
            if let output = currentFilter.outputImage,
                let cgimg = context.createCGImage(output, from: output.extent) {
                let processedImage = UIImage(cgImage: cgimg)
                return processedImage
            }
        }
        return nil
    }

    func imageGreyScale() -> UIImage {
        let imageRect = CGRect(x: 0, y: 0, width: self.size.width, height: self.size.height)
        let greyContext = CGContext(
            data: nil, width: Int(self.size.width), height: Int(self.size.height),
            bitsPerComponent: 8, bytesPerRow: 0,
            space: CGColorSpaceCreateDeviceGray(),
            bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.none.rawValue).rawValue

        )
        let alphaContext = CGContext(data: nil, width: Int(self.size.width), height: Int(self.size.height), bitsPerComponent: 8, bytesPerRow: 0, space: CGColorSpaceCreateDeviceGray(), bitmapInfo: CGImageAlphaInfo.none.rawValue
        )

        greyContext?.draw(self.cgImage!, in: imageRect)
        alphaContext?.draw(self.cgImage!, in: imageRect)

        let greyImage = greyContext!.makeImage()
        let maskImage = alphaContext!.makeImage()
        let combinedImage = greyImage!.masking(maskImage!)
        return UIImage(cgImage: combinedImage!)
    }

    func imageWithOverlayTint(tintColor: UIColor) -> UIImage {
        if tintColor == UIColor.px_blueMercadoPago() {
            return self
        } else {
            UIGraphicsBeginImageContextWithOptions(self.size, false, 0)
            let bounds = CGRect(x: 0, y: 0, width: self.size.width, height: self.size.height)
            self.draw(in: bounds)
            tintColor.setFill()
            UIRectFillUsingBlendMode(bounds, CGBlendMode.darken)

            self.draw(in: bounds, blendMode: CGBlendMode.destinationIn, alpha: 1.0)
            let tintedImage = UIGraphicsGetImageFromCurrentImageContext()
            UIGraphicsEndImageContext()
            return tintedImage!
        }
    }

    func mask(color: UIColor) -> UIImage? {

        UIGraphicsBeginImageContextWithOptions(self.size, false, self.scale)
        guard let context = UIGraphicsGetCurrentContext() else {
            return nil
        }

        let rect = CGRect(origin: CGPoint.zero, size: size)

        color.setFill()
        self.draw(in: rect)

        context.setBlendMode(.sourceIn)
        context.fill(rect)

        if let resultImage = UIGraphicsGetImageFromCurrentImageContext() {
            UIGraphicsEndImageContext()
            return resultImage
        } else {
            UIGraphicsEndImageContext()
            return nil
        }
    }

    func alpha(_ value:CGFloat) -> UIImage {
        UIGraphicsBeginImageContextWithOptions(size, false, scale)
        draw(at: CGPoint.zero, blendMode: .normal, alpha: value)
        let newImage = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        return newImage!
    }
}
