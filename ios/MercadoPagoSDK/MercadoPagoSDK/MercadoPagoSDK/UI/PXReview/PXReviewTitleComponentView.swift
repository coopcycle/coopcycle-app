//
//  PXReviewTitleComponentView.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 3/3/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

final class PXReviewTitleComponentView: PXComponentView {

    fileprivate let VIEW_HEIGHT: CGFloat = 38
    fileprivate let MATCH_WIDTH_PERCENT: CGFloat = 95

    fileprivate let titleLabel: UILabel = UILabel()

    init(withTitle: String, titleColor: UIColor, backgroundColor: UIColor) {
        super.init()

        self.backgroundColor = backgroundColor

        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        titleLabel.textAlignment = .center
        titleLabel.numberOfLines = 1
        titleLabel.attributedText = NSAttributedString(string: withTitle, attributes: [NSAttributedString.Key.font: Utils.getFont(size: PXLayout.L_FONT)])
        titleLabel.textColor = titleColor

        self.addSubview(titleLabel)

        PXLayout.pinTop(view: titleLabel, to: self, withMargin: PXLayout.XXS_MARGIN).isActive = true
        PXLayout.centerHorizontally(view: titleLabel).isActive = true
        PXLayout.matchWidth(ofView: titleLabel, toView: self, withPercentage: MATCH_WIDTH_PERCENT).isActive = true

        PXLayout.setHeight(owner: self, height: VIEW_HEIGHT).isActive = true
    }

    required public init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
