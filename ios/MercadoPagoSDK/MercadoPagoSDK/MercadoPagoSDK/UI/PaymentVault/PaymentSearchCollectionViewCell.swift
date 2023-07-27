//
//  PaymentSearchCollectionViewCell.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 10/25/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import UIKit

class PaymentSearchCollectionViewCell: UICollectionViewCell {

    @IBOutlet weak var titleSearch: UILabel!
    @IBOutlet weak var subtitleSearch: UILabel!
    @IBOutlet weak var paymentOptionImageContainer: UIView!

    override func awakeFromNib() {
        super.awakeFromNib()
    }

    override func prepareForReuse() {
        for subview in paymentOptionImageContainer.subviews {
            subview.removeFromSuperview()
        }
    }

    public func fillCell(image: UIImage?, title: String? = "", subtitle: NSAttributedString?, isDisabled: Bool) {
        titleSearch.text = title
        titleSearch.font = Utils.getFont(size: titleSearch.font.pointSize)

        subtitleSearch.attributedText = subtitle

        let image = isDisabled ? image?.imageGreyScale() : image
        addPaymentOptionIconComponent(image: image)
        if isDisabled {
            addWarningBadge()
        }

        backgroundColor = .white
        titleSearch.textColor = UIColor.black
        layoutIfNeeded()
    }

    func getConstraintFor(label: UILabel) -> NSLayoutConstraint {
        return NSLayoutConstraint(item: self.subtitleSearch, attribute: .height, relatedBy: .equal, toItem: nil, attribute: .notAnAttribute, multiplier: 1.0, constant: label.requiredHeight())
    }

    func totalHeight() -> CGFloat {
        return titleSearch.requiredHeight() + subtitleSearch.requiredHeight() + 112
    }

    func fillCell(drawablePaymentOption: PaymentOptionDrawable, discountInfo: String? = nil, creditsInfo: String? = nil) {
        let image = drawablePaymentOption.getImage()
        let subtitle = creditsInfo ?? drawablePaymentOption.getSubtitle()

        let attributedSubtitle = PaymentSearchCollectionViewCell.getSubtitleAttributedString(subtitle: subtitle, discountInfo: discountInfo, fontSize: subtitleSearch.font.pointSize, textColor: subtitleSearch.textColor)

        self.fillCell(image: image,
                      title: drawablePaymentOption.getTitle(),
                      subtitle: attributedSubtitle,
                      isDisabled: drawablePaymentOption.isDisabled())
    }

    func fillCell(optionText: String) {
        self.fillCell(image: nil,
                      title: optionText,
                      subtitle: nil,
                      isDisabled: false)
    }

    static func getSubtitleAttributedString(subtitle: String?, discountInfo: String? = nil, fontSize: CGFloat = 15, textColor: UIColor = .black) -> NSAttributedString {
        let normalAttributes: [NSAttributedString.Key: AnyObject] = [NSAttributedString.Key.font: Utils.getFont(size: fontSize), NSAttributedString.Key.foregroundColor: textColor]
        let discountAttributes: [NSAttributedString.Key: AnyObject] = [NSAttributedString.Key.font: Utils.getSemiBoldFont(size: fontSize), NSAttributedString.Key.foregroundColor: ThemeManager.shared.noTaxAndDiscountLabelTintColor()]

        let subtitleAttributedString = NSMutableAttributedString(string: subtitle ?? "", attributes: normalAttributes)

        guard let discountInfo = discountInfo else {
            return subtitleAttributedString
        }

        let discountAttributedString = NSAttributedString(string: discountInfo, attributes: discountAttributes)
        return discountAttributedString
    }

    static func totalHeight(drawablePaymentOption: PaymentOptionDrawable, discountInfo: String? = nil, creditsInfo: String? = nil) -> CGFloat {

        let subtitleText = creditsInfo ?? drawablePaymentOption.getSubtitle()
        let subtitleAttr = getSubtitleAttributedString(subtitle: subtitleText, discountInfo: discountInfo)
        return PaymentSearchCollectionViewCell.totalHeight(title: drawablePaymentOption.getTitle(), subtitle: subtitleAttr.string)
    }

    static func totalHeight(title: String?, subtitle: String?) -> CGFloat {
        let screenSize: CGRect = UIScreen.main.bounds
        let screenWidth = screenSize.width
        let availableWidth = screenWidth - (screenWidth * 0.3)
        let widthPerItem = availableWidth / 2

        let titleLabel = UILabel(frame: CGRect(x: 0, y: 0, width: widthPerItem, height: 0))
        titleLabel.font = UIFont.systemFont(ofSize: 16)
        titleLabel.text = title
        let subtitleLabel = UILabel(frame: CGRect(x: 0, y: 0, width: widthPerItem, height: 0))
        subtitleLabel.font = UIFont.systemFont(ofSize: 15)
        subtitleLabel.text = subtitle
        let altura1 = titleLabel.requiredHeight()
        let altura2 = subtitleLabel.requiredHeight()
        return altura1 + altura2 + 112
    }
}

extension PaymentSearchCollectionViewCell {

    private func addWarningBadge() {
        let image = ResourceManager.shared.getImage("warning_badge")
        let warningBadgeIcon = UIImageView(image: image)
        paymentOptionImageContainer.insertSubview(warningBadgeIcon, at: 2)

        PXLayout.setHeight(owner: warningBadgeIcon, height: paymentOptionImageContainer.frame.width / 2).isActive = true
        PXLayout.setWidth(owner: warningBadgeIcon, width: paymentOptionImageContainer.frame.width / 2).isActive = true
        PXLayout.pinTop(view: warningBadgeIcon, withMargin: -PXLayout.XXS_MARGIN).isActive = true
        PXLayout.pinRight(view: warningBadgeIcon, withMargin: -PXLayout.S_MARGIN).isActive = true
    }

    fileprivate func addPaymentOptionIconComponent(image: UIImage?) {
        let paymentMethodIconComponent = PXPaymentMethodIconComponent(props: PXPaymentMethodIconProps(paymentMethodIcon: image)).render()

        paymentMethodIconComponent.layer.cornerRadius = paymentOptionImageContainer.frame.width / 2

        paymentMethodIconComponent.removeFromSuperview()

        paymentOptionImageContainer.insertSubview(paymentMethodIconComponent, at: 0)

        PXLayout.centerHorizontally(view: paymentMethodIconComponent).isActive = true
        PXLayout.setHeight(owner: paymentMethodIconComponent, height: paymentOptionImageContainer.frame.width).isActive = true
        PXLayout.setWidth(owner: paymentMethodIconComponent, width: paymentOptionImageContainer.frame.width).isActive = true
        PXLayout.pinTop(view: paymentMethodIconComponent, withMargin: 0).isActive = true
    }
}
