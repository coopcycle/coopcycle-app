//
//  PXReviewConfirmConfiguration.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 6/8/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

/**
 This object declares custom preferences (customizations) for "Review and Confirm" screen.
 */
@objcMembers open class PXReviewConfirmConfiguration: NSObject {
    private static let DEFAULT_AMOUNT_TITLE = "Precio Unitario: ".localized
    private static let DEFAULT_QUANTITY_TITLE = "Cantidad: ".localized

    private var itemsEnabled: Bool = true
    private var topCustomView: UIView?
    private var bottomCustomView: UIView?

    // For only 1 PM Scenario. (Internal)
    private var changePaymentMethodsEnabled: Bool = true

    /// :nodoc:
    override init() {}

    // MARK: Init.
    /**
     - parameter itemsEnabled: Determinate if items view should be display or not.
     - parameter topView: Optional custom top view.
     - parameter bottomView: Optional custom bottom view.
     */
    public init(itemsEnabled: Bool, topView: UIView? = nil, bottomView: UIView? = nil) {
        self.itemsEnabled = itemsEnabled
        self.topCustomView = topView
        self.bottomCustomView = bottomView
    }

    // MARK: To deprecate post v4. SP integration.
    internal var summaryTitles: [SummaryType: String] {
        get {
            return [SummaryType.PRODUCT: "Producto".localized,
                    SummaryType.ARREARS: "Mora".localized,
                    SummaryType.CHARGE: "Cargos".localized,
                    SummaryType.DISCOUNT: String(format: "discount".localized, 2),
                    SummaryType.TAXES: "Impuestos".localized,
                    SummaryType.SHIPPING: "Envío".localized]
        }
    }

    internal var details: [SummaryType: SummaryDetail] = [SummaryType: SummaryDetail]()
}

// MARK: - Internal Getters.
extension PXReviewConfirmConfiguration {
    internal func hasItemsEnabled() -> Bool {
        return itemsEnabled
    }

    internal func getTopCustomView() -> UIView? {
        return self.topCustomView
    }

    internal func getBottomCustomView() -> UIView? {
        return self.bottomCustomView
    }
}

/** :nodoc: */
// Payment method.
// MARK: To deprecate post v4. SP integration.
internal extension PXReviewConfirmConfiguration {
    func isChangeMethodOptionEnabled() -> Bool {
        return changePaymentMethodsEnabled
    }

    func disableChangeMethodOption() {
        changePaymentMethodsEnabled = false
    }
}

/** :nodoc: */
// Amount.
// MARK: To deprecate post v4. SP integration.
internal extension PXReviewConfirmConfiguration {
    func shouldShowAmountTitle() -> Bool {
        return true
    }

    func getAmountTitle() -> String {
        return PXReviewConfirmConfiguration.DEFAULT_AMOUNT_TITLE
    }
}

/** :nodoc: */
// Collector icon.
// MARK: To deprecate post v4. SP integration.
internal extension PXReviewConfirmConfiguration {
    func getCollectorIcon() -> UIImage? {
        return nil
    }
}

/** :nodoc: */
// Quantity row.
// MARK: To deprecate post v4. SP integration.
internal extension PXReviewConfirmConfiguration {
    func shouldShowQuantityRow() -> Bool {
        return true
    }

    func getQuantityLabel() -> String {
        return PXReviewConfirmConfiguration.DEFAULT_QUANTITY_TITLE
    }
}

/** :nodoc: */
// Disclaimer text.
// MARK: To deprecate post v4. SP integration.
internal extension PXReviewConfirmConfiguration {
    func getDisclaimerText() -> String? {
        return nil
    }

    func getDisclaimerTextColor() -> UIColor {
        return ThemeManager.shared.noTaxAndDiscountLabelTintColor()
    }
}

/** :nodoc: */
// Summary.
// MARK: To deprecate post v4. SP integration.
internal extension PXReviewConfirmConfiguration {
    // Not in Android.
    func addSummaryProductDetail(amount: Double) {
        self.addDetail(detail: SummaryItemDetail(amount: amount), type: SummaryType.PRODUCT)
    }

    func addSummaryDiscountDetail(amount: Double) {
        self.addDetail(detail: SummaryItemDetail(amount: amount), type: SummaryType.DISCOUNT)
    }

    func addSummaryTaxesDetail(amount: Double) {
        self.addDetail(detail: SummaryItemDetail(amount: amount), type: SummaryType.TAXES)
    }

    func addSummaryShippingDetail(amount: Double) {
        self.addDetail(detail: SummaryItemDetail(amount: amount), type: SummaryType.SHIPPING)
    }

    func addSummaryArrearsDetail(amount: Double) {
        self.addDetail(detail: SummaryItemDetail(amount: amount), type: SummaryType.ARREARS)
    }

    func setSummaryProductTitle(productTitle: String) {
        self.updateTitle(type: SummaryType.PRODUCT, title: productTitle)
    }

    private func updateTitle(type: SummaryType, title: String) {
        if self.details[type] != nil {
            self.details[type]?.title = title
        } else {
            self.details[type] = SummaryDetail(title: title, detail: nil)
        }
        if type == SummaryType.DISCOUNT {
            self.details[type]?.titleColor = UIColor.mpGreenishTeal()
            self.details[type]?.amountColor = UIColor.mpGreenishTeal()
        }
    }

    private func getOneWordDescription(oneWordDescription: String) -> String {
        if oneWordDescription.count <= 0 {
            return ""
        }
        if let firstWord = oneWordDescription.components(separatedBy: " ").first {
            return firstWord
        } else {
            return oneWordDescription
        }
    }

    private func addDetail(detail: SummaryItemDetail, type: SummaryType) {
        if self.details[type] != nil {
            self.details[type]?.details.append(detail)
        } else {
            guard let title = self.summaryTitles[type] else {
                self.details[type] = SummaryDetail(title: "", detail: detail)
                return
            }
            self.details[type] = SummaryDetail(title: title, detail: detail)
        }
        if type == SummaryType.DISCOUNT {
            self.details[type]?.titleColor = UIColor.mpGreenishTeal()
            self.details[type]?.amountColor = UIColor.mpGreenishTeal()
        }
    }

    func getSummaryTotalAmount() -> Double {
        var totalAmount = 0.0
        guard let productDetail = details[SummaryType.PRODUCT] else {
            return 0.0
        }
        if productDetail.getTotalAmount() <= 0 {
            return 0.0
        }
        for summaryType in details.keys {
            if let detailAmount = details[summaryType]?.getTotalAmount() {
                if summaryType == SummaryType.DISCOUNT {
                    totalAmount -= detailAmount
                } else {
                    totalAmount += detailAmount
                }
            }
        }
        return totalAmount
    }
}
