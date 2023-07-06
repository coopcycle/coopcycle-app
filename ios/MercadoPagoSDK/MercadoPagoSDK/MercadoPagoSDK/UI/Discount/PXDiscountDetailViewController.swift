//
//  PXDiscountDetailViewController.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 28/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import UIKit

final class PXDiscountDetailViewController: MercadoPagoUIViewController {

    private var amountHelper: PXAmountHelper
    private let fontSize: CGFloat = PXLayout.S_FONT
    private let baselineOffSet: Int = 6
    private let fontColor = ThemeManager.shared.boldLabelTintColor()
    private let discountFontColor = ThemeManager.shared.noTaxAndDiscountLabelTintColor()
    private let currency = SiteManager.shared.getCurrency()
    private let discountReason: PXDiscountReason?
    let contentView: PXComponentView = PXComponentView()

    init(amountHelper: PXAmountHelper, discountReason: PXDiscountReason? = nil) {
        self.amountHelper = amountHelper
        self.discountReason = discountReason
        super.init(nibName: nil, bundle: nil)
    }

    override public func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        trackScreen()
    }

    required public init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override public func viewDidLoad() {
        super.viewDidLoad()
        if self.contentView.isEmpty() {
            renderViews()
        }
    }
}

// MARK: Getters
extension PXDiscountDetailViewController {
    func getContentView() -> PXComponentView {
        renderViews()
        return self.contentView
    }
}

// MARK: Render Views
extension PXDiscountDetailViewController {

    private func renderViews() {

        if let title = getTitle() {
            buildAndAddLabel(to: self.contentView, margin: PXLayout.M_MARGIN, with: title, height: 20, accessibilityIdentifier: "discount_detail_title_label")
        }

        if let disclaimer = getDisclaimer() {
            buildAndAddLabel(to: self.contentView, margin: PXLayout.XS_MARGIN, with: disclaimer, accessibilityIdentifier: "discount_detail_disclaimer_label")
        }

        if let description = getDescription() {
            buildAndAddLabel(to: self.contentView, margin: PXLayout.XXS_MARGIN, with: description, height: 34, accessibilityIdentifier: "discount_detail_description_label")
        }

        if let legalTerms = getLegalTerms() {
            let legalTermsLabel = buildAndAddLabel(to: self.contentView, margin: PXLayout.XXS_MARGIN, with: legalTerms, accessibilityIdentifier: "discount_legal_terms_label")
            let tap = UITapGestureRecognizer(target: self, action: #selector(handleTap(_:)))
            legalTermsLabel.addGestureRecognizer(tap)
            legalTermsLabel.isUserInteractionEnabled = true
        }

        if !amountHelper.consumedDiscount {
            buildSeparatorLine(in: self.contentView, topMargin: PXLayout.M_MARGIN, sideMargin: PXLayout.M_MARGIN, height: 1)

        }
        if let footerMessage = getFooterMessage() {
            buildAndAddLabel(to: self.contentView, margin: PXLayout.S_MARGIN, with: footerMessage, accessibilityIdentifier: "discount_detail_footer_label")
        }

        self.contentView.pinLastSubviewToBottom(withMargin: PXLayout.M_MARGIN)?.isActive = true
        self.view.addSubview(contentView)
        PXLayout.matchWidth(ofView: contentView).isActive = true
        PXLayout.matchHeight(ofView: contentView).isActive = true
        PXLayout.centerHorizontally(view: contentView).isActive = true
        PXLayout.centerVertically(view: contentView).isActive = true
    }

    @discardableResult
    func buildAndAddLabel(to view: PXComponentView, margin: CGFloat, with text: NSAttributedString, height: CGFloat? = nil, accessibilityIdentifier: String) -> UILabel {
        let label = UILabel()
        label.translatesAutoresizingMaskIntoConstraints = false
        label.numberOfLines = 0
        label.attributedText = text
        label.accessibilityIdentifier = accessibilityIdentifier
        view.addSubviewToBottom(label, withMargin: margin)
        if let height = height {
            PXLayout.setHeight(owner: label, height: height).isActive = true
        }
        PXLayout.pinLeft(view: label, withMargin: PXLayout.M_MARGIN).isActive = true
        PXLayout.pinRight(view: label, withMargin: PXLayout.M_MARGIN).isActive = true
        return label
    }

    func buildSeparatorLine(in view: PXComponentView, topMargin: CGFloat, sideMargin: CGFloat, height: CGFloat) {
        let line = UIView()
        line.translatesAutoresizingMaskIntoConstraints = false
        view.addSubviewToBottom(line, withMargin: topMargin)
        PXLayout.setHeight(owner: line, height: height).isActive = true
        PXLayout.pinLeft(view: line, withMargin: sideMargin).isActive = true
        PXLayout.pinRight(view: line, withMargin: sideMargin).isActive = true
        line.alpha = 0.6
        line.backgroundColor = ThemeManager.shared.greyColor()
    }

    func getTitle() -> NSAttributedString? {
        let fontSize = PXLayout.XS_FONT
        if amountHelper.consumedDiscount, discountReason?.title?.message?.isNotEmpty ?? false {
            return nil
        } else if let maxCouponAmount = amountHelper.maxCouponAmount, !amountHelper.consumedDiscount {
            let attributes = [NSAttributedString.Key.font: Utils.getSemiBoldFont(size: fontSize), NSAttributedString.Key.foregroundColor: ThemeManager.shared.boldLabelTintColor()]
            let amountAttributedString = Utils.getAttributedAmount(withAttributes: attributes, amount: maxCouponAmount, currency: currency, negativeAmount: false)
            let string: String = ("discount_detail_modal_disclaimer".localized as NSString).replacingOccurrences(of: "{0}", with: amountAttributedString.string)
            let attributedString = NSMutableAttributedString(string: string, attributes: attributes)

            return attributedString
        }
        return nil
    }

    func getDisclaimer() -> NSAttributedString? {
        let fontSize = PXLayout.XXS_FONT
        let attributes = [NSAttributedString.Key.font: Utils.getLightFont(size: fontSize), NSAttributedString.Key.foregroundColor: ThemeManager.shared.greyColor()]
        if amountHelper.consumedDiscount {
            if let discountReasonDescription = discountReason?.description?.getAttributedString(fontSize: fontSize) {
                return discountReasonDescription
            } else {
                return NSAttributedString(string: "modal_content_consumed_discount".localized, attributes: attributes)
            }
        } else if amountHelper.campaign?.maxRedeemPerUser == 1 {
            var message = "unique_discount_detail_modal_footer".localized
            if let expirationDate = amountHelper.campaign?.endDate {
                let messageDate = "discount_end_date".localized
                message.append(messageDate.replacingOccurrences(of: "{0}", with: Utils.getFormatedStringDate(expirationDate)))
            }
            return NSAttributedString(string: message, attributes: attributes)
        } else if let maxRedeemPerUser = amountHelper.campaign?.maxRedeemPerUser, maxRedeemPerUser > 1 {
            return NSAttributedString(string: "multiple_discount_detail_modal_footer".localized, attributes: attributes)
        }
        return nil
    }

    func getDescription() -> NSAttributedString? {
        //TODO: descuentos por medio de pago
        return nil
    }

    func getFooterMessage() -> NSAttributedString? {
        if amountHelper.consumedDiscount {
            return nil
        }
        let attributes = [NSAttributedString.Key.font: Utils.getLightFont(size: PXLayout.XXS_FONT), NSAttributedString.Key.foregroundColor: ThemeManager.shared.greyColor()]
        let string = NSAttributedString(string: "discount_detail_modal_footer".localized, attributes: attributes)
        return string
    }

    func getLegalTerms() -> NSAttributedString? {
        if amountHelper.campaign?.legalTermsUrl == nil {
            return nil
        }
        let attributes = [NSAttributedString.Key.font: Utils.getSemiBoldFont(size: PXLayout.XXS_FONT), NSAttributedString.Key.foregroundColor: ThemeManager.shared.getAccentColor()]
        let string = NSAttributedString(string: "terms_and_conditions_title".localized, attributes: attributes)
        return string
    }
}

// MARK: Accions
extension PXDiscountDetailViewController {
    @objc func handleTap(_ sender: UITapGestureRecognizer) {
        let SCREEN_TITLE = "terms_and_conditions_title".localized

        if let legalTermsURLString = amountHelper.campaign?.legalTermsUrl, let url = URL(string: legalTermsURLString) {
            let webVC = WebViewController(url: url, navigationBarTitle: SCREEN_TITLE, forceAddNavBar: true)
            webVC.title = SCREEN_TITLE
            present(webVC, animated: true)
        }
    }
}

// MARK: Tracking
extension PXDiscountDetailViewController {
    func trackScreen() {
        var properties: [String: Any] = [:]
        properties["discount"] = amountHelper.getDiscountForTracking()

        trackScreen(path: TrackingPaths.Screens.getDiscountDetailPath(), properties: properties)
    }
}
