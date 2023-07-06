//
//  CardNotAvailableView.swift
//  MercadoPagoSDK
//
//  Created by Angie Arlanti on 8/29/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

class CardNotAvailableErrorView: UIView {

    let margin: CGFloat = 10
    var errorMessageLabel: MPLabel!
    var errorMessage: String!
    var moreInfoMessage: String!
    var moreInfoLabel: MPLabel!
    var paymentMethods: [PXPaymentMethod]!
    var showAvaibleCardsCallback: (() -> Void)?
    let MESSAGE_WIDTH_PERCENT: CGFloat = 0.75
    let MORE_INFO_WIDTH_PERCENT: CGFloat = 0.25

    init(frame: CGRect, paymentMethods: [PXPaymentMethod], showAvaibleCardsCallback: (() -> Void)?) {
        super.init(frame: frame)
        self.backgroundColor = ThemeManager.shared.rejectedColor()
        self.paymentMethods = paymentMethods
        self.showAvaibleCardsCallback = showAvaibleCardsCallback
        errorMessage = "No puedes pagar con esta tarjeta".localized
        moreInfoMessage = "MAS INFO".localized
        setErrorMessage()
        setMoreInfoButton()

    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    func setErrorMessage () {
        self.errorMessageLabel = MPLabel(frame: getErrorMessageFrame())
        self.errorMessageLabel!.text = errorMessage
        self.errorMessageLabel.textColor = .white
        self.errorMessageLabel.textAlignment = .left
        self.errorMessageLabel.font = Utils.getLightFont(size: 14)
        self.addSubview(errorMessageLabel)
    }

    func setMoreInfoButton() {
        self.moreInfoLabel = MPLabel(frame: getMoreInfoFrame())
        self.moreInfoLabel.text = moreInfoMessage
        self.moreInfoLabel.textColor = .white
        self.moreInfoLabel.textAlignment = .right
        self.moreInfoLabel.font = Utils.getFont(size: 14)
        let tap = UITapGestureRecognizer(target: self, action: #selector(CardNotAvailableErrorView.handleTap))
        self.moreInfoLabel.isUserInteractionEnabled = true
        self.moreInfoLabel.addGestureRecognizer(tap)

        self.addSubview(moreInfoLabel)

    }

    func getMoreInfoFrame() -> CGRect {
        let errorMessageWidth = (self.frame.width - (3 * margin)) * MESSAGE_WIDTH_PERCENT
        let xPos = errorMessageWidth + 2 * margin
        let moreInfoWidth = (self.frame.width - (3 * margin)) * MORE_INFO_WIDTH_PERCENT
        let height = self.frame.height - 2 * margin
        return CGRect(x: xPos, y: margin, width: moreInfoWidth, height: height)
    }

    func getErrorMessageFrame() -> CGRect {
         let errorMessageWidth = (self.frame.width - (3 * margin)) * MESSAGE_WIDTH_PERCENT
        let height = self.frame.height - 2 * margin
        return CGRect(x: margin, y: margin, width: errorMessageWidth, height: height)
    }

    @objc func handleTap () {
        guard let callback = self.showAvaibleCardsCallback else {
            return
        }
        callback()
    }
}
