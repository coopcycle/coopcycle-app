//
//  PXOneTapSummaryRowView.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 18/12/2018.
//

import UIKit

class PXOneTapSummaryRowView: UIView {

    typealias Handler = () -> Void

    enum RowType {
        case discount
        case charges
        case generic
    }

    private var data: PXOneTapSummaryRowData
    private var titleLabel: UILabel?
    private var iconImageView: UIImageView?
    private var valueLabel: UILabel?

    init(data: PXOneTapSummaryRowData) {
        self.data = data
        super.init(frame: CGRect.zero)
        render()
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    open func getData() -> PXOneTapSummaryRowData {
        return data
    }

    func getTotalHeightNeeded() -> CGFloat {
        return getRowHeight() + getRowMargin()
    }

    open func getRowMargin() -> CGFloat {
        return data.isTotal ? PXLayout.ZERO_MARGIN : PXLayout.XXS_MARGIN
    }

    open func getRowHeight() -> CGFloat {
        if data.isTotal {
            if !UIDevice.isSmallDevice() {
                return 52
            } else {
                return 48
            }
        } else {
            return 16
        }
    }

    func update(_ newData: PXOneTapSummaryRowData) {
        self.data = newData
        self.updateUI(animated: true)
    }

    private func updateUI(animated: Bool = false) {
        let duration = 0.5

        if animated {
            titleLabel?.fadeTransition(duration)
            iconImageView?.fadeTransition(duration)
            valueLabel?.fadeTransition(duration)
        }

        titleLabel?.text = data.title
        titleLabel?.textColor = data.highlightedColor
        titleLabel?.alpha = data.alpha

        iconImageView?.image = data.image
        iconImageView?.isHidden = data.image == nil

        valueLabel?.text = data.value
        valueLabel?.textColor = data.highlightedColor
        valueLabel?.alpha = data.alpha
    }

    private func render() {
        removeAllSubviews()
        let rowHeight = getRowHeight()
        let titleFont = data.isTotal ? UIFont.ml_regularSystemFont(ofSize: PXLayout.S_FONT) : UIFont.ml_regularSystemFont(ofSize: PXLayout.XXS_FONT)
        let valueFont = data.isTotal ? UIFont.ml_semiboldSystemFont(ofSize: PXLayout.S_FONT) : UIFont.ml_regularSystemFont(ofSize: PXLayout.XXS_FONT)
        let shouldAnimate = data.isTotal ? false : true

        if data.isTotal {
            self.backgroundColor = ThemeManager.shared.navigationBar().backgroundColor
        }

        self.translatesAutoresizingMaskIntoConstraints = false
        self.pxShouldAnimatedOneTapRow = shouldAnimate

        let titleLabel = UILabel()
        self.titleLabel = titleLabel
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        titleLabel.text = data.title
        titleLabel.textAlignment = .left
        titleLabel.font = titleFont
        self.addSubview(titleLabel)
        PXLayout.pinLeft(view: titleLabel, withMargin: PXLayout.L_MARGIN).isActive = true
        PXLayout.centerVertically(view: titleLabel).isActive = true

        let imageView: UIImageView = UIImageView()
        self.iconImageView = imageView
        let imageSize: CGFloat = 16
        imageView.contentMode = .scaleAspectFit
        self.addSubview(imageView)
        PXLayout.setWidth(owner: imageView, width: imageSize).isActive = true
        PXLayout.setHeight(owner: imageView, height: imageSize).isActive = true
        PXLayout.centerVertically(view: imageView, to: titleLabel).isActive = true
        PXLayout.put(view: imageView, rightOf: titleLabel, withMargin: PXLayout.XXXS_MARGIN).isActive = true

        let valueLabel = UILabel()
        self.valueLabel = valueLabel
        valueLabel.translatesAutoresizingMaskIntoConstraints = false
        valueLabel.text = data.value
        valueLabel.textAlignment = .right
        valueLabel.font = valueFont
        self.addSubview(valueLabel)
        PXLayout.pinRight(view: valueLabel, withMargin: PXLayout.L_MARGIN).isActive = true
        PXLayout.centerVertically(view: valueLabel).isActive = true
        PXLayout.setHeight(owner: self, height: rowHeight).isActive = true

        updateUI()
    }
}
