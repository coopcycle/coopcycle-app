//
//  TitleValueView.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 9/7/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

final class TitleValueView: UIView, PXComponent {

    fileprivate let VERTICAL_MARGIN: CGFloat = 2.0
    fileprivate let HORIZONTAL_MARGIN: CGFloat = 24.0
    fileprivate let TITLE_WIDTH_PERCENT: CGFloat = 0.5
    fileprivate let VALUE_WIDTH_PERCENT: CGFloat = 0.5
    static fileprivate let FONT_SIZE: CGFloat = PXLayout.S_FONT

    fileprivate var titleFontSize: CGFloat!
    fileprivate var valueFontSize: CGFloat!
    fileprivate var titleLabel: UILabel!
    fileprivate var valueLabel: UILabel?

    public init(frame: CGRect, titleText: String, valueDouble: Double, colorTitle: UIColor = ThemeManager.shared.boldLabelTintColor(), colorValue: UIColor = ThemeManager.shared.boldLabelTintColor(), upperSeparatorLine: Bool = false, valueEnable: Bool = true, titleFontSize: CGFloat = FONT_SIZE, valueFontSize: CGFloat = FONT_SIZE) {
        super.init(frame: frame)
        titleLabel = UILabel(frame: getTitleFrame())
        titleLabel.textAlignment = .left
        titleLabel.textColor = colorTitle
        titleLabel.font = Utils.getFont(size: titleFontSize)
        titleLabel.text = titleText
        titleLabel.numberOfLines = 1
        self.addSubview(titleLabel)
        if valueEnable {
            valueLabel = UILabel(frame: getValueFrame())
            let currency = SiteManager.shared.getCurrency()
            var attributedTotal: NSAttributedString
            if valueDouble < 0 {
                attributedTotal = Utils.getAttributedAmount(-valueDouble, currency: currency, color: colorValue, fontSize: valueFontSize, baselineOffset: 5, negativeAmount: true)
            } else {
                attributedTotal = Utils.getAttributedAmount(valueDouble, currency: currency, color: colorValue, fontSize: valueFontSize, baselineOffset: 5)
            }

            valueLabel?.textAlignment = .right
            valueLabel?.textColor = colorValue
            valueLabel?.font = Utils.getFont(size: valueFontSize)
            valueLabel?.attributedText = attributedTotal
            self.addSubview(valueLabel!)
        }
        if upperSeparatorLine {
            self.addSeparatorLineToTop(horizontalMargin: HORIZONTAL_MARGIN, width: self.frame.size.width - 2 * HORIZONTAL_MARGIN, height: 1)
        }
        self.adjustViewFrames()
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension TitleValueView {

    func getHeight() -> CGFloat {
        return self.titleLabel.requiredHeight(numberOfLines: 1) + 2 * VERTICAL_MARGIN
    }

    func getWeight() -> CGFloat {
        return self.frame.size.width
    }

    func getTitleFrame() -> CGRect {
        return CGRect(x: HORIZONTAL_MARGIN, y: VERTICAL_MARGIN, width: (self.frame.size.width - 3 * HORIZONTAL_MARGIN) * VALUE_WIDTH_PERCENT, height: self.frame.size.height - 2 * VERTICAL_MARGIN)
    }

    func getValueFrame() -> CGRect {
        return CGRect(x: HORIZONTAL_MARGIN + ((self.frame.size.width - 3 * HORIZONTAL_MARGIN) * VALUE_WIDTH_PERCENT) + HORIZONTAL_MARGIN, y: VERTICAL_MARGIN, width: (self.frame.size.width - 3 * HORIZONTAL_MARGIN) * VALUE_WIDTH_PERCENT, height: self.frame.size.height - 2 * VERTICAL_MARGIN)
    }

    func adjustViewFrames() {
        let frameTitle = self.titleLabel.frame
        self.titleLabel.frame = CGRect(x: frameTitle.origin.x, y: frameTitle.origin.y, width: frameTitle.size.width, height: self.titleLabel.requiredHeight(numberOfLines: 1))
    }
}
