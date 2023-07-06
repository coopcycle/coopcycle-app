//
//  PXDefaultMLStyleSheet.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 1/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation
import MLUI

class PXDefaultMLStyleSheet: NSObject, MLStyleSheetProtocol {

    var primaryColor: UIColor
    var lightPrimaryColor: UIColor
    var secondaryColor: UIColor
    var secondaryColorPressed: UIColor
    var secondaryColorDisabled: UIColor
    var modalBackgroundColor: UIColor
    var modalTintColor: UIColor

    var successColor: UIColor = MLStyleSheetDefault().successColor
    var warningColor: UIColor = MLStyleSheetDefault().warningColor
    var errorColor: UIColor = MLStyleSheetDefault().errorColor
    var blackColor: UIColor = MLStyleSheetDefault().blackColor
    var darkGreyColor: UIColor = MLStyleSheetDefault().darkGreyColor
    var greyColor: UIColor = MLStyleSheetDefault().greyColor
    var midGreyColor: UIColor = MLStyleSheetDefault().midGreyColor
    var lightGreyColor: UIColor = MLStyleSheetDefault().lightGreyColor
    var whiteColor: UIColor = MLStyleSheetDefault().whiteColor

    public init(withPrimaryColor: UIColor) {
        primaryColor = withPrimaryColor
        lightPrimaryColor = withPrimaryColor
        secondaryColor = withPrimaryColor
        secondaryColorPressed = withPrimaryColor
        secondaryColorDisabled = lightGreyColor
        modalBackgroundColor = withPrimaryColor
        modalTintColor = .white
    }

    func regularSystemFont(ofSize fontSize: CGFloat) -> UIFont {
        return MLStyleSheetDefault().regularSystemFont(ofSize: fontSize)
    }

    func boldSystemFont(ofSize fontSize: CGFloat) -> UIFont {
        return MLStyleSheetDefault().boldSystemFont(ofSize: fontSize)
    }

    func thinSystemFont(ofSize fontSize: CGFloat) -> UIFont {
        return MLStyleSheetDefault().thinSystemFont(ofSize: fontSize)
    }

    func lightSystemFont(ofSize fontSize: CGFloat) -> UIFont {
        return MLStyleSheetDefault().lightSystemFont(ofSize: fontSize)
    }

    func mediumSystemFont(ofSize fontSize: CGFloat) -> UIFont {
        return MLStyleSheetDefault().mediumSystemFont(ofSize: fontSize)
    }

    func semiboldSystemFont(ofSize fontSize: CGFloat) -> UIFont {
        return MLStyleSheetDefault().semiboldSystemFont(ofSize: fontSize)
    }

    func extraboldSystemFont(ofSize fontSize: CGFloat) -> UIFont {
        return MLStyleSheetDefault().extraboldSystemFont(ofSize: fontSize)
    }

    func blackSystemFont(ofSize fontSize: CGFloat) -> UIFont {
        return MLStyleSheetDefault().blackSystemFont(ofSize: fontSize)
    }
}
