//
//  AccountMoneyCard.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 17/10/18.
//

import Foundation
import MLCardDrawer

class AccountMoneyCard: NSObject, CustomCardDrawerUI {
    var placeholderName = ""
    var placeholderExpiration = ""
    var bankImage: UIImage?
    var cardPattern = [0]
    var cardFontColor: UIColor = UIColor(red: 105 / 255, green: 105 / 255, blue: 105 / 255, alpha: 1)
    var cardLogoImage: UIImage?
    var cardBackgroundColor: UIColor = UIColor(red: 0.00, green: 0.64, blue: 0.85, alpha: 1.0)
    var securityCodeLocation: MLCardSecurityCodeLocation = .back
    var defaultUI = false
    var securityCodePattern = 3
    var fontType: String = "light"
    var ownOverlayImage: UIImage? = UIImage()
}

extension AccountMoneyCard {
    static func render(containerView: UIView, isDisabled: Bool, size: CGSize) {
        let amImage = UIImageView()
        amImage.backgroundColor = .clear
        amImage.contentMode = .scaleAspectFit
        let amImageRaw = ResourceManager.shared.getImage("amImage")
        amImage.image = isDisabled ? amImageRaw?.imageGreyScale() : amImageRaw
        amImage.alpha = 0.6
        containerView.addSubview(amImage)
        PXLayout.setWidth(owner: amImage, width: size.height * 0.65).isActive = true
        PXLayout.setHeight(owner: amImage, height: size.height * 0.65).isActive = true
        PXLayout.pinTop(view: amImage).isActive = true
        PXLayout.pinRight(view: amImage).isActive = true

        if !isDisabled {
            let patternView = UIImageView()
            patternView.contentMode = .scaleAspectFit
            patternView.image = ResourceManager.shared.getImage("amPattern")
            containerView.addSubview(patternView)

            let height = size.height
            let width = height * 1.1

            PXLayout.setHeight(owner: patternView, height: height).isActive = true
            PXLayout.setWidth(owner: patternView, width: width).isActive = true
            PXLayout.pinTop(view: patternView).isActive = true
            PXLayout.pinRight(view: patternView).isActive = true
        }

        let amLogo = UIImageView()
        amLogo.backgroundColor = .clear
        amLogo.contentMode = .scaleAspectFit
        let logoImage = ResourceManager.shared.getImage("amLogo")
        amLogo.image = isDisabled ? logoImage?.imageGreyScale() : logoImage
        containerView.addSubview(amLogo)
        PXLayout.setWidth(owner: amLogo, width: size.height * 0.60).isActive = true
        PXLayout.setHeight(owner: amLogo, height: size.height * 0.35).isActive = true
        PXLayout.pinTop(view: amLogo, withMargin: PXLayout.XXXS_MARGIN).isActive = true
        PXLayout.pinLeft(view: amLogo, withMargin: PXLayout.S_MARGIN).isActive = true
    }
}
