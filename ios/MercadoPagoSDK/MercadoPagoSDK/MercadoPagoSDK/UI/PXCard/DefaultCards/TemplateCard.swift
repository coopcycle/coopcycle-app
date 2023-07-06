//
//  TemplateCard.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 25/10/18.
//

import Foundation
import MLCardDrawer

// TemplateCard
class TemplateCard: NSObject, CardUI {
    var placeholderName = ""
    var placeholderExpiration = ""
    var bankImage: UIImage?
    var cardPattern = [4, 4, 4, 4]
    var cardFontColor: UIColor = .white
    var cardLogoImage: UIImage?
    var cardBackgroundColor: UIColor = UIColor(red: 0.23, green: 0.31, blue: 0.39, alpha: 1.0)
    var securityCodeLocation: MLCardSecurityCodeLocation = .back
    var defaultUI = true
    var securityCodePattern = 3
    var fontType: String = "light"
}
