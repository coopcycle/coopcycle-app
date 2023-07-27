//
//  PXTermsAndConditionView.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 5/3/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

protocol PXTermsAndConditionViewDelegate: NSObjectProtocol {
    func shouldOpenTermsCondition(_ title: String, url: URL)
}

class PXTermsAndConditionView: PXComponentView {
    var SCREEN_TITLE = "terms_and_conditions_title"
    internal let DEFAULT_CREDITS_HEIGHT = CGFloat(80)

    private let termsAndConditionsText: MPTextView = MPTextView()
    var termsAndConditionsDto: PXTermsDto?

    weak var delegate: PXTermsAndConditionViewDelegate?

    init(shouldAddMargins: Bool = true, termsDto: PXTermsDto? = nil, delegate: PXTermsAndConditionViewDelegate? = nil) {
        super.init()

        self.delegate = delegate
        self.termsAndConditionsDto = termsDto
        self.termsAndConditionsText.backgroundColor = .clear
        translatesAutoresizingMaskIntoConstraints = false

        termsAndConditionsText.isUserInteractionEnabled = true
        termsAndConditionsText.isEditable = false
        termsAndConditionsText.delegate = self
        termsAndConditionsText.translatesAutoresizingMaskIntoConstraints = false
        termsAndConditionsText.attributedText = getTyCText()
        termsAndConditionsText.backgroundColor = .clear

        if termsAndConditionsDto == nil {
            //generic terms and conditions case, the whole cell will react presenting the generic tyc webview
            let tap = UITapGestureRecognizer(target: self, action: #selector(handleTap(_:)))
            tap.delegate = self
            self.addGestureRecognizer(tap)
        }

        addSubview(termsAndConditionsText)

        let URLAttribute: [NSAttributedString.Key: Any] = [NSAttributedString.Key.font: UIFont(name: ResourceManager.shared.DEFAULT_FONT_NAME, size: 12) ?? UIFont.systemFont(ofSize: 12), NSAttributedString.Key.foregroundColor: ThemeManager.shared.secondaryColor()]

        termsAndConditionsText.linkTextAttributes = URLAttribute

        let PERCENT_WIDTH: CGFloat = 90.0
        PXLayout.matchWidth(ofView: termsAndConditionsText, toView: self, withPercentage: PERCENT_WIDTH).isActive = true
        PXLayout.centerHorizontally(view: termsAndConditionsText).isActive = true

        var topAndBottomMargins = PXLayout.S_MARGIN
        if !shouldAddMargins {
            topAndBottomMargins = PXLayout.ZERO_MARGIN
        }

        PXLayout.pinTop(view: termsAndConditionsText, withMargin: topAndBottomMargins).isActive = true
        PXLayout.pinBottom(view: termsAndConditionsText, withMargin: topAndBottomMargins).isActive = true

        let screenWidth = PXLayout.getScreenWidth(applyingMarginFactor: PERCENT_WIDTH)
        let dynamicSize: CGSize = termsAndConditionsText.sizeThatFits(CGSize(width: screenWidth, height: CGFloat.greatestFiniteMagnitude))
        PXLayout.setHeight(owner: termsAndConditionsText, height: dynamicSize.height).isActive = true
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension PXTermsAndConditionView {

    func getTyCText() -> NSMutableAttributedString {
        let termsAndConditionsText = termsAndConditionsDto?.text ?? "review_terms_and_conditions".localized

        let normalAttributes: [NSAttributedString.Key: AnyObject] = [NSAttributedString.Key.font: Utils.getFont(size: PXLayout.XXXS_FONT), NSAttributedString.Key.foregroundColor: ThemeManager.shared.labelTintColor()]

        let mutableAttributedString = NSMutableAttributedString(string: termsAndConditionsText, attributes: normalAttributes)

        let defaultLinkablePhrase = PXLinkablePhraseDto(textColor: "", phrase: SCREEN_TITLE.localized, link: SiteManager.shared.getTermsAndConditionsURL(), html: "", installments: nil)

        let phrases = termsAndConditionsDto?.linkablePhrases ?? [defaultLinkablePhrase]

        for linkablePhrase in phrases {
            if let customLink = linkablePhrase.link {
                let tycLinkRange = (termsAndConditionsText as NSString).range(of: linkablePhrase.phrase)
                mutableAttributedString.addAttribute(NSAttributedString.Key.link, value: customLink, range: tycLinkRange)
            } else if let customHtml = linkablePhrase.html {
                let htmlUrl = HtmlStorage.shared.set(customHtml)
                let tycLinkRange = (termsAndConditionsText as NSString).range(of: linkablePhrase.phrase)
                mutableAttributedString.addAttribute(NSAttributedString.Key.link, value: htmlUrl, range: tycLinkRange)
            }
        }

        let style = NSMutableParagraphStyle()
        style.alignment = .center
        style.lineSpacing = CGFloat(3)

        mutableAttributedString.addAttribute(NSAttributedString.Key.paragraphStyle, value: style, range: NSRange(location: 0, length: mutableAttributedString.length))
        return mutableAttributedString
    }
}

extension PXTermsAndConditionView: UITextViewDelegate, UIGestureRecognizerDelegate {
    @objc func handleTap(_ sender: UITapGestureRecognizer) {
        if let url = URL(string: SiteManager.shared.getTermsAndConditionsURL()) {
            delegate?.shouldOpenTermsCondition(SCREEN_TITLE.localized, url: url)
        }
    }

    func textView(_ textView: UITextView, shouldInteractWith URL: URL, in characterRange: NSRange, interaction: UITextItemInteraction) -> Bool {
        if termsAndConditionsDto != nil {
            if let range = Range(characterRange, in: textView.text),
                let text = textView.text?[range] {
                let title = String(text).capitalized
                delegate?.shouldOpenTermsCondition(title, url: URL)
            }
        }
        return false
    }
}

