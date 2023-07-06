//
//  PXNewResultViewModel.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 27/08/2019.
//

import Foundation

struct ResultViewData {
    let view: UIView
    let verticalMargin: CGFloat
    let horizontalMargin: CGFloat
}

protocol PXNewResultViewModelInterface {
    //HEADER
    func getHeaderColor() -> UIColor
    func getHeaderTitle() -> String
    func getHeaderIcon() -> UIImage?
    func getHeaderURLIcon() -> String?
    func getHeaderBadgeImage() -> UIImage?
    func getHeaderCloseAction() -> (() -> Void)?

    //RECEIPT
    func mustShowReceipt() -> Bool
    func getReceiptId() -> String?

    //POINTS AND DISCOUNTS
    ////POINTS
    func getPoints() -> PXPoints?
    func getPointsTapAction() -> ((_ deepLink: String) -> Void)?

    ////DISCOUNTS
    func getDiscounts() -> PXDiscounts?
    func getDiscountsTapAction() -> ((_ index: Int, _ deepLink: String?, _ trackId: String?) -> Void)?

    ////CROSS SELLING
    func getCrossSellingItems() -> [PXCrossSellingItem]?
    func getCrossSellingTapAction() -> ((_ deepLink: String) -> Void)?

    //INSTRUCTIONS
    func hasInstructions() -> Bool
    func getInstructionsView() -> UIView?

    //PAYMENT METHOD
    func shouldShowPaymentMethod() -> Bool
    func getPaymentData() -> PXPaymentData?
    func getAmountHelper() -> PXAmountHelper?

    //SPLIT PAYMENT METHOD
    func getSplitPaymentData() -> PXPaymentData?
    func getSplitAmountHelper() -> PXAmountHelper?

    //REJECTED BODY
    func shouldShowErrorBody() -> Bool
    func getErrorBodyView() -> UIView?

    //FOOTER
    func getFooterMainAction() -> PXAction?
    func getFooterSecondaryAction() -> PXAction?

    //CUSTOM VIEWS
    ////IMPORTANT
    func getImportantView() -> UIView?

    //CONSUMER CREDITS EXPECTATION VIEW
    func getCreditsExpectationView() -> UIView?

    ////TOP CUSTOM
    func getTopCustomView() -> UIView?

    ////BOTTOM CUSTOM
    func getBottomCustomView() -> UIView?

    //CALLBACKS & TRACKING
    func setCallback(callback: @escaping ( _ status: PaymentResult.CongratsState) -> Void)
    func getTrackingProperties() -> [String: Any]
    func getTrackingPath() -> String
    func getFlowBehaviourResult() -> PXResultKey
}
