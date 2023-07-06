//
//  PXDiscountTermsAndConditionView.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 28/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

final class PXDiscountTermsAndConditionView: PXTermsAndConditionView {

    private var amountHelper: PXAmountHelper

    init(amountHelper: PXAmountHelper, shouldAddMargins: Bool = true) {
        self.amountHelper = amountHelper
        super.init(shouldAddMargins: shouldAddMargins)
        self.SCREEN_TITLE = "terms_and_conditions_title"
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func getTyCText() -> NSMutableAttributedString {
        let highlightedText = "review_discount_terms_and_conditions_link".localized
        let termsAndConditionsText = "review_discount_terms_and_conditions".localized + " \(highlightedText)"
        let normalAttributes: [NSAttributedString.Key: AnyObject] = [NSAttributedString.Key.font: Utils.getFont(size: PXLayout.XXXS_FONT), NSAttributedString.Key.foregroundColor: ThemeManager.shared.labelTintColor()]

        let mutableAttributedString = NSMutableAttributedString(string: termsAndConditionsText, attributes: normalAttributes)
        let tycLinkRange = (termsAndConditionsText as NSString).range(of: highlightedText)

        mutableAttributedString.addAttribute(NSAttributedString.Key.link, value: self.getTyCURL(), range: tycLinkRange)

        let style = NSMutableParagraphStyle()
        style.alignment = .center
        style.lineSpacing = CGFloat(3)

        mutableAttributedString.addAttribute(NSAttributedString.Key.paragraphStyle, value: style, range: NSRange(location: 0, length: mutableAttributedString.length))
        return mutableAttributedString
    }

    override func handleTap(_ sender: UITapGestureRecognizer) {
        if let url = URL(string: self.getTyCURL()) {
            delegate?.shouldOpenTermsCondition(SCREEN_TITLE.localized, url: url)
        }
    }

    func getTyCURL() -> String {
        if let legalTermsURL = self.amountHelper.campaign?.legalTermsUrl {
            return legalTermsURL
        }
        return ""
    }
}
