//
//  PaymentMethodAvailableView.swift
//  MercadoPagoSDK
//
//  Created by Angie Arlanti on 8/28/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

class CardAvailableView: UIView {

    let marginHeigh: CGFloat = 5
    var imageView: UIImageView = UIImageView()
    var paymentMethodNameLabel: UILabel = UILabel()
    var imageMargin: CGFloat!
    var imageWidth: CGFloat!

    init(frame: CGRect, paymentMethod: PXPaymentMethod) {
        super.init(frame: frame)
        self.backgroundColor = .white

        let image = ResourceManager.shared.getImageForPaymentMethod(withDescription: paymentMethod.id, defaultColor: false)
        setImageView(image: image)

        if let paymentMethodName = paymentMethod.name {
            setPaymentMethodNameLabel(name: paymentMethodName)
        }
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    func setPaymentMethodNameLabel(name: String) {
        paymentMethodNameLabel.frame = self.getFrameToLabel()
        paymentMethodNameLabel.text = name
        paymentMethodNameLabel.font = Utils.getFont(size: 16)
        paymentMethodNameLabel.textColor = ThemeManager.shared.boldLabelTintColor()
        self.addSubview(paymentMethodNameLabel)
    }

    func setImageView(image: UIImage?) {
        imageView.frame = getFrameOfImage()
        imageView.image = image
        imageView.contentMode = .scaleAspectFit
        self.addSubview(imageView)
    }

    func getFrameToLabel() -> CGRect {
        let heightImage: CGFloat = frame.size.height - (2 * marginHeigh)
        let xPos: CGFloat = (imageMargin * 2) + imageWidth
        let labelWidth: CGFloat = frame.size.width - xPos - marginHeigh
        return CGRect(x: xPos, y: marginHeigh, width: labelWidth, height: heightImage)
    }

    func getFrameOfImage() -> CGRect {
        imageMargin = marginHeigh * 4
        let heightImage: CGFloat = frame.size.height - (2 * marginHeigh)
        imageWidth = heightImage
        return CGRect(x: imageMargin, y: marginHeigh, width: imageWidth, height: heightImage)
    }

}
