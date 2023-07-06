//
//  AvailableCardsViewModel.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 29/11/2018.
//

import Foundation

internal class AvailableCardsViewModel {

    let MARGIN_X_SCROLL_VIEW: CGFloat = 32
    let MIN_HEIGHT_PERCENT: CGFloat = 0.73
    let screenSize: CGRect
    let screenHeight: CGFloat
    let screenWidth: CGFloat

    var paymentMethods: [PXPaymentMethod]!
    init(paymentMethods: [PXPaymentMethod]) {
        self.paymentMethods = paymentMethods
        self.screenSize = UIScreen.main.bounds
        self.screenHeight = screenSize.height
        self.screenWidth = screenSize.width
    }
    func getDatailViewFrame() -> CGRect {

        let availableCardsViewWidth = screenWidth - 2 * MARGIN_X_SCROLL_VIEW
        let availableCardsViewTotalHeight = getAvailableCardsViewTotalHeight(headerHeight: AvailableCardsDetailView.HEADER_HEIGHT, paymentMethodsHeight: AvailableCardsDetailView.ITEMS_HEIGHT, paymentMethodsCount: CGFloat(self.paymentMethods.count))

        let xPos = (self.screenWidth - availableCardsViewWidth) / 2
        let yPos = (self.screenHeight - availableCardsViewTotalHeight) / 2
        return CGRect(x: xPos, y: yPos, width: availableCardsViewWidth, height: availableCardsViewTotalHeight)
    }

    func getEnterCardMessage() -> String {
        return "Ingresar otra tarjeta".localized
    }

    func getAvailableCardsViewTotalHeight(headerHeight: CGFloat, paymentMethodsHeight: CGFloat, paymentMethodsCount: CGFloat) -> CGFloat {
        var totalHeight = headerHeight + paymentMethodsHeight * paymentMethodsCount
        if totalHeight > screenHeight * MIN_HEIGHT_PERCENT {
            totalHeight = screenHeight * MIN_HEIGHT_PERCENT
        }
        return totalHeight
    }
}
