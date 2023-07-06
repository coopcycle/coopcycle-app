//
//  PXOneTapSummaryRowRenderer.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 16/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

final class PXOneTapSummaryRowRenderer: PXXibRenderer {
    private var props: PXSummaryRowProps?
    @IBOutlet weak var contentView: UIView!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var subtitleLabel: UILabel!
    @IBOutlet weak var amountLabel: UILabel!

    var subtitleHeightConstraint: NSLayoutConstraint?

    init(withProps: PXSummaryRowProps) {
        super.init(frame: CGRect(x: 0, y: 0, width: 0, height: 0))
        props = withProps
        loadXib(rendererComponentizableClass: self)
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
    }

    // MARK: - Mandatory override PXXibRenderer
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }

    override func xibName() -> String {
        return "PXOneTapSummaryRowView"
    }

    override func containerView() -> UIView {
        return contentView
    }

    override func renderXib() -> UIView {
        setupStyles()
        populateProps()
        setupConstraints()
        return self
    }
}

// MARK: - Setup methods.
extension PXOneTapSummaryRowRenderer {
    func setupConstraints() {
        PXLayout.setHeight(owner: titleLabel, height: 18).isActive = true
        PXLayout.setHeight(owner: amountLabel, height: 18).isActive = true
        subtitleHeightConstraint = PXLayout.setHeight(owner: subtitleLabel, height: 18)
        subtitleHeightConstraint?.isActive = true

        PXLayout.pinLeft(view: titleLabel, withMargin: PXLayout.M_MARGIN).isActive = true
        PXLayout.pinTop(view: titleLabel, withMargin: PXLayout.S_MARGIN).isActive = true

        PXLayout.centerVertically(view: amountLabel, to: titleLabel).isActive = true
        PXLayout.pinRight(view: amountLabel, withMargin: PXLayout.M_MARGIN).isActive = true
        PXLayout.put(view: amountLabel, rightOf: titleLabel, withMargin: 8, relation: .greaterThanOrEqual).isActive = true

        PXLayout.pinLeft(view: subtitleLabel, to: titleLabel).isActive = true
        PXLayout.pinRight(view: subtitleLabel, to: amountLabel).isActive = true
        PXLayout.put(view: subtitleLabel, onBottomOf: titleLabel, withMargin: PXLayout.XXXS_MARGIN).isActive = true
        PXLayout.pinBottom(view: subtitleLabel, withMargin: PXLayout.S_MARGIN).isActive = true
    }

    private func setupStyles() {
        contentView.backgroundColor = .clear
        titleLabel.textColor = ThemeManager.shared.labelTintColor()
        amountLabel.textColor = ThemeManager.shared.labelTintColor()
        subtitleLabel.textColor = ThemeManager.shared.greyColor()
        contentView.backgroundColor = props?.backgroundColor
    }

    private func populateProps() {
        if let componentProps = props {
            subtitleLabel.text = nil
            titleLabel.text = componentProps.title
            amountLabel.text = componentProps.rightText
            if let subTitleText = componentProps.subTitle {
                subtitleLabel.text = subTitleText
            } else {
                subtitleHeightConstraint?.constant = 0
            }
        }
    }
}
