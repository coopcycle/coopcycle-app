//
//  EmptyCard.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 17/10/18.
//

import Foundation
import MLCardDrawer

struct PXAddNewMethodData {
    let title: PXText?
    let subtitle: PXText?
}

class EmptyCard: NSObject, CardUI {
    let newCardData: PXAddNewMethodData?
    let newOfflineData: PXAddNewMethodData?
    var placeholderName = ""
    var placeholderExpiration = ""
    var bankImage: UIImage?
    var cardPattern = [0]
    var cardFontColor: UIColor = UIColor(red: 105 / 255, green: 105 / 255, blue: 105 / 255, alpha: 1)
    var cardLogoImage: UIImage?
    var cardBackgroundColor: UIColor = UIColor(red: 239 / 255, green: 239 / 255, blue: 239 / 255, alpha: 1)
    var securityCodeLocation: MLCardSecurityCodeLocation = .back
    var defaultUI = true
    var securityCodePattern = 3
    var fontType: String = "dark"

    init(newCardData: PXAddNewMethodData?, newOfflineData: PXAddNewMethodData?) {
        self.newCardData = newCardData
        self.newOfflineData = newOfflineData
    }
}

extension EmptyCard {
    func render(containerView: UIView) {
        let circleView = UIView()
        let circleSize: CGFloat = 60
        containerView.addSubview(circleView)
        circleView.backgroundColor = .white
        circleView.layer.cornerRadius = circleSize / 2
        circleView.dropShadow(radius: 2, opacity: 0.15, offset: CGSize(width: 0.3, height: 0.3))
        PXLayout.setHeight(owner: circleView, height: circleSize).isActive = true
        PXLayout.setWidth(owner: circleView, width: circleSize).isActive = true
        PXLayout.centerVertically(view: circleView, withMargin: -PXLayout.S_MARGIN).isActive = true
        PXLayout.centerHorizontally(view: circleView).isActive = true

        let label = UILabel()
        let textColor = ThemeManager.shared.getAccentColor()
        label.attributedText = newCardData?.title?.getAttributedString(fontSize: PXLayout.XXS_FONT, textColor: textColor, backgroundColor: .clear)
        label.textAlignment = .center
        containerView.addSubview(label)
        PXLayout.pinLeft(view: label, withMargin: 0).isActive = true
        PXLayout.pinRight(view: label, withMargin: 0).isActive = true
        PXLayout.put(view: label, onBottomOf: circleView, withMargin: PXLayout.S_MARGIN).isActive = true
        PXLayout.setHeight(owner: label, height: PXLayout.S_FONT).isActive = true
        PXLayout.centerHorizontally(view: label).isActive = true

        let addImage = UIImageView()
        let imageSize: CGFloat = 18
        addImage.image = ResourceManager.shared.getImage("oneTapAdd")
        addImage.contentMode = .scaleAspectFit
        circleView.addSubview(addImage)
        PXLayout.setHeight(owner: addImage, height: imageSize).isActive = true
        PXLayout.setWidth(owner: addImage, width: imageSize).isActive = true
        PXLayout.centerVertically(view: addImage).isActive = true
        PXLayout.centerHorizontally(view: addImage).isActive = true
    }
}
