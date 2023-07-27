//
//  PXResultAddCardSuccessViewModel.swift
//  MercadoPagoSDKV4
//
//  Created by Diego Flores Domenech on 24/9/18.
//

import UIKit

final class PXResultAddCardSuccessViewModel: PXResultViewModelInterface {

    let buttonCallback: () -> Void
    var callback: ((PaymentResult.CongratsState) -> Void)?

    init(buttonCallback: @escaping () -> Void) {
        self.buttonCallback = buttonCallback
    }

    func getPaymentData() -> PXPaymentData {
        return PXPaymentData()
    }

    func primaryResultColor() -> UIColor {
        return ThemeManager.shared.successColor()
    }

    func setCallback(callback: @escaping (PaymentResult.CongratsState) -> Void) {
        self.callback = callback
    }

    func getPaymentStatus() -> String {
        return ""
    }

    func getPaymentStatusDetail() -> String {
        return ""
    }

    func getPaymentId() -> String? {
        return nil
    }

    func isCallForAuth() -> Bool {
        return false
    }

    func buildHeaderComponent() -> PXHeaderComponent {
        let productImage = ResourceManager.shared.getImage("card_icon")
        let statusImage = ResourceManager.shared.getImage("ok_badge")
        
        let props = PXHeaderProps(labelText: nil, title: NSAttributedString(string: "add_card_congrats_title".localized, attributes: [NSAttributedString.Key.font: UIFont.ml_regularSystemFont(ofSize: 26)]), backgroundColor: ThemeManager.shared.successColor(), productImage: productImage, statusImage: statusImage, closeAction: { [weak self] in
            if let callback = self?.callback {
                callback(PaymentResult.CongratsState.cancel_EXIT)
            }
        })
        let header = PXHeaderComponent(props: props)
        return header
    }

    func buildFooterComponent() -> PXFooterComponent {
        let buttonAction = PXAction(label: "add_card_go_to_my_cards".localized, action: self.buttonCallback)
        let props = PXFooterProps(buttonAction: buttonAction, linkAction: nil, primaryColor: UIColor.ml_meli_blue(), animationDelegate: nil)
        let footer = PXFooterComponent(props: props)
        return footer
    }

    func buildReceiptComponent() -> PXReceiptComponent? {
        return nil
    }

    func buildBodyComponent() -> PXComponentizable? {
        return nil
    }

    func buildTopCustomView() -> UIView? {
        return nil
    }

    func buildBottomCustomView() -> UIView? {
        return nil
    }

    func getTrackingProperties() -> [String: Any] {
        return [:]
    }

    func getTrackingPath() -> String {
        return ""
    }

    func getFooterPrimaryActionTrackingPath() -> String {
        return ""
    }

    func getFooterSecondaryActionTrackingPath() -> String {
        return ""
    }

    func getHeaderCloseButtonTrackingPath() -> String {
        return ""
    }
}
