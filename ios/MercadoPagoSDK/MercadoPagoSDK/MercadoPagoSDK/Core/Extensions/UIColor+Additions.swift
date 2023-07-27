//
//  UIColor+Additions.swift
//  MercadoPagoSDK
//
//  Created by Matias Gualino on 30/12/14.
//  Copyright (c) 2014 com.mercadopago. All rights reserved.
//

import Foundation
import UIKit

internal extension UIColor {

    class func UIColorFromRGB(_ rgbValue: UInt) -> UIColor {
        return UIColor(
            red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
            green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
            blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
            alpha: CGFloat(1.0)
        )
    }

    class func fromHex(_ hexValue: String) -> UIColor {
        let hexAlphabet = "0123456789abcdefABCDEF"
        let hex = hexValue.trimmingCharacters(in: CharacterSet(charactersIn: hexAlphabet).inverted)
        var hexInt = UInt32()
        Scanner(string: hex).scanHexInt32(&hexInt)

        let alpha, red, green, blue: UInt32
        switch hex.count {
        case 3: (alpha, red, green, blue) = (255, (hexInt >> 8) * 17, (hexInt >> 4 & 0xF) * 17, (hexInt & 0xF) * 17) // RGB
        case 6: (alpha, red, green, blue) = (255, hexInt >> 16, hexInt >> 8 & 0xFF, hexInt & 0xFF) // RRGGBB
        case 8: (alpha, red, green, blue) = (hexInt >> 24, hexInt >> 16 & 0xFF, hexInt >> 8 & 0xFF, hexInt & 0xFF) // AARRGGBB
        default: return UIColor.black
        }
        return UIColor(red: CGFloat(red)/255, green: CGFloat(green)/255, blue: CGFloat(blue)/255, alpha: CGFloat(alpha)/255)
    }

    convenience init(red: Int, green: Int, blue: Int) {
        assert(red >= 0 && red <= 255, "Invalid red component")
        assert(green >= 0 && green <= 255, "Invalid green component")
        assert(blue >= 0 && blue <= 255, "Invalid blue component")

        self.init(red: CGFloat(red) / 255.0, green: CGFloat(green) / 255.0, blue: CGFloat(blue) / 255.0, alpha: 1.0)
    }

    convenience init(netHex: Int) {
        self.init(red: (netHex >> 16) & 0xff, green: (netHex >> 8) & 0xff, blue: netHex & 0xff)
    }

    class func mpDefaultColor() -> UIColor {
        return UIColorFromRGB(0x009EE3)
    }

    class func errorCellColor() -> UIColor {
        return UIColorFromRGB(0xB34C42)
    }

    class func greenOkColor() -> UIColor {
        return UIColorFromRGB(0x6FBB2A)
    }

    class func redFailureColor() -> UIColor {
        return UIColorFromRGB(0xB94A48)
    }

    class func px_errorValidationTextColor() -> UIColor {
        return UIColorFromRGB(0xB34C42)
    }

    class func yellowFailureColor() -> UIColor {
        return UIColorFromRGB(0xF5CC00)
    }

    class func px_blueMercadoPago() -> UIColor {
        return UIColorFromRGB(0x009EE3)
    }
    class func lightBlue() -> UIColor {
        return UIColorFromRGB(0x3F9FDA)
    }
    class func px_grayBaseText() -> UIColor {
        return UIColorFromRGB(0x333333)
    }

    class func px_grayDark() -> UIColor {
        return UIColorFromRGB(0x666666)
    }

    class func px_grayLight() -> UIColor {
        return UIColorFromRGB(0x999999)
    }

    class func grayTableSeparator() -> UIColor {
        return UIColorFromRGB(0xEFEFF4)
    }
    class func px_backgroundColor() -> UIColor {
        return UIColorFromRGB(0xEBEBF0)
    }

    class func installments() -> UIColor {
        return UIColorFromRGB(0x2BA2EC)
    }

    class func px_redCongrats() -> UIColor {
        return UIColorFromRGB(0xFF6E6E)
    }

    class func px_greenCongrats() -> UIColor {
        return UIColorFromRGB(0x0DB478)
    }

    class func grayStatusBar() -> UIColor {
        return UIColorFromRGB(0xE6E6E6)
    }

    class func mpLightGray() -> UIColor {
        return UIColorFromRGB(0xEEEEEE)
    }

    class func mpRedPinkErrorMessage() -> UIColor {
        return UIColorFromRGB(0xF04449)
    }

    class func mpRedErrorMessage() -> UIColor {
        return UIColorFromRGB(0xf04449)
    }
    class func primaryColor() -> UIColor {
        return ThemeManager.shared.getMainColor()
    }
    class func mpGreenishTeal() -> UIColor {
        return UIColorFromRGB(0x3bc280)
    }

    class func cardDefaultColor() -> UIColor {
        return UIColor(netHex: 0xEEEEEE)
    }

    class func px_grayBackgroundColor() -> UIColor {
        return UIColorFromRGB(0xF7F7F7)
    }

    class func instructionsHeaderColor() -> UIColor {
        return UIColor(red: 255, green: 161, blue: 90)
    }

    func lighter() -> UIColor {
        return self.adjust(0.25, green: 0.25, blue: 0.25, alpha: 1)
    }

    func adjust(_ red: CGFloat, green: CGFloat, blue: CGFloat, alpha: CGFloat) -> UIColor {
        var redVar: CGFloat = 0, greenVar: CGFloat = 0, blueVar: CGFloat = 0, alphaVar: CGFloat = 0
        self.getRed(&redVar, green: &greenVar, blue: &blueVar, alpha: &alphaVar)
        return UIColor(red: redVar + red, green: greenVar + green, blue: blueVar + blue, alpha: alphaVar + alpha)
    }
}

// COMPONENTS
internal extension UIColor {
    class var pxWarmGray: UIColor {
        return UIColor(white: 153.0 / 255.0, alpha: 1.0)
    }

    class var pxBrownishGray: UIColor {
        return UIColor(white: 102.0 / 255.0, alpha: 1.0)
    }

    class var pxBlueMp: UIColor {
        return UIColor(red: 0.0, green: 156.0 / 255.0, blue: 238.0 / 255.0, alpha: 1.0)
    }

    class var pxGreenMp: UIColor {
        return UIColor(red: 0.0, green: 198.0 / 255.0, blue: 119.0 / 255.0, alpha: 1.0)
    }

    class var pxRedMp: UIColor {
        return UIColor(red: 255.0 / 255.0, green: 78.0 / 255.0, blue: 85.0 / 255.0, alpha: 1.0)
    }

    class var pxOrangeMp: UIColor {
        return UIColor(red: 255.0 / 255.0, green: 166.0 / 255.0, blue: 68.0 / 255.0, alpha: 1.0)
    }

    class var pxLightGray: UIColor {
        return UIColor(white: 247.0 / 255.0, alpha: 1.0)
    }

    class var pxMediumLightGray: UIColor {
        return UIColor(red: 238.0 / 255.0, green: 238.0 / 255.0, blue: 238.0 / 255.0, alpha: 1.0)
    }
}
