//
//  PXCFTComponentView.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 7/3/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

final class PXCFTComponentView: PXComponentView {

    fileprivate lazy var VIEW_HEIGHT: CGFloat = 44
    fileprivate lazy var MATCH_WIDTH_PERCENT: CGFloat = 95

    fileprivate let cftLabel: UILabel = UILabel()

    init(withCFTValue: String?, titleColor: UIColor, backgroundColor: UIColor) {

        super.init()

        self.backgroundColor = backgroundColor

        if let cftValue = withCFTValue {

            cftLabel.translatesAutoresizingMaskIntoConstraints = false
            cftLabel.textAlignment = .center
            cftLabel.numberOfLines = 1
            cftLabel.attributedText = NSAttributedString(string: "CFT \(cftValue)", attributes: [NSAttributedString.Key.font: Utils.getLightFont(size: PXLayout.M_FONT)])
            cftLabel.textColor = titleColor
            cftLabel.accessibilityIdentifier = "CFT_label"
            self.addSubview(cftLabel)

            PXLayout.pinTop(view: cftLabel, to: self).isActive = true
            PXLayout.centerHorizontally(view: cftLabel).isActive = true
            PXLayout.matchWidth(ofView: cftLabel, toView: self, withPercentage: MATCH_WIDTH_PERCENT).isActive = true
            PXLayout.setHeight(owner: self, height: VIEW_HEIGHT).isActive = true
        }
    }

    required public init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
