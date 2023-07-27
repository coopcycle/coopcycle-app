//
//  PXOneTapHeaderMerchantView.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/10/18.
//

import UIKit

class PXOneTapHeaderMerchantView: PXComponentView {
    let image: UIImage
    let title: String
    private var subTitle: String?
    private var showHorizontally: Bool
    private var layout: PXOneTapHeaderMerchantLayout
    private var imageView: PXUIImageView?

    init(image: UIImage, title: String, subTitle: String? = nil, showHorizontally: Bool) {
        self.image = image
        self.title = title
        self.showHorizontally = showHorizontally
        self.subTitle = subTitle
        self.layout = PXOneTapHeaderMerchantLayout(layoutType: subTitle == nil ? .onlyTitle : .titleSubtitle)
        super.init()
        render()
    }

    required public init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    private func render() {
        PXLayout.setHeight(owner: self, height: layout.IMAGE_SIZE, relation: .greaterThanOrEqual).isActive = true

        let containerView = UIView()
        // The image of the merchant
        let imageContainerView = buildImageContainerView(image: image)
        containerView.addSubview(imageContainerView)
        // The title
        let titleLabel = buildTitleLabel(text: title)
        containerView.addSubview(titleLabel)
        addSubviewToBottom(containerView)

        if layout.getLayoutType() == .onlyTitle {
            layout.makeConstraints(containerView, imageContainerView, titleLabel)
        } else {
            // The subTitle
            let subTitleLabel = buildSubTitleLabel(text: subTitle)
            containerView.addSubview(subTitleLabel)
            layout.makeConstraints(containerView, imageContainerView, titleLabel, subTitleLabel)
        }
        
        let direction: OneTapHeaderAnimationDirection = showHorizontally ? .horizontal : .vertical
        animateHeaderLayout(direction: direction)

        isUserInteractionEnabled = true
    }

    private func buildImageContainerView(image: UIImage) -> UIView {
        let imageContainerView = UIView()
        imageContainerView.translatesAutoresizingMaskIntoConstraints = false
        imageContainerView.dropShadow(radius: 2, opacity: 0.15)
        let imageView = PXUIImageView()
        imageView.layer.masksToBounds = false
        imageView.layer.cornerRadius = layout.IMAGE_SIZE / 2
        imageView.clipsToBounds = true
        imageView.translatesAutoresizingMaskIntoConstraints = false
        imageView.enableFadeIn()
        imageView.backgroundColor = .white
        imageView.image = image
        imageContainerView.addSubview(imageView)
        _ = PXLayout.pinAllEdges(view: imageView).map { $0.isActive = true }
        self.imageView = imageView
        return imageContainerView
    }

    private func buildTitleLabel(text: String) -> UILabel {
        let titleLabel = UILabel()
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        titleLabel.text = text
        titleLabel.numberOfLines = 2
        titleLabel.lineBreakMode = .byTruncatingTail
        titleLabel.font = UIFont.ml_semiboldSystemFont(ofSize: PXLayout.M_FONT)
        titleLabel.textColor = ThemeManager.shared.statusBarStyle() == UIStatusBarStyle.default ? UIColor.black : ThemeManager.shared.whiteColor()
        titleLabel.textAlignment = .center
        titleLabel.setContentHuggingPriority(.defaultHigh, for: .vertical)

        return titleLabel
    }

    private func buildSubTitleLabel(text: String?) -> UILabel {
        let subTitleLabel = UILabel()
        subTitleLabel.translatesAutoresizingMaskIntoConstraints = false
        subTitleLabel.text = text ?? ""
        subTitleLabel.numberOfLines = 1
        subTitleLabel.lineBreakMode = .byTruncatingTail
        subTitleLabel.setContentHuggingPriority(.defaultLow, for: .vertical)
        subTitleLabel.font = UIFont.ml_regularSystemFont(ofSize: PXLayout.XXXS_FONT)
        subTitleLabel.textColor = ThemeManager.shared.statusBarStyle() == UIStatusBarStyle.default ? UIColor.black : ThemeManager.shared.whiteColor()
        subTitleLabel.textAlignment = .center
        return subTitleLabel
    }
}

// MARK: Publics
extension PXOneTapHeaderMerchantView {
    func updateContentViewLayout(margin: CGFloat = PXLayout.M_MARGIN) {
        layoutIfNeeded()
        if UIDevice.isLargeDevice() || UIDevice.isExtraLargeDevice() {
            self.pinContentViewToTop(margin: margin)
        } else if !UIDevice.isSmallDevice() {
            self.pinContentViewToTop()
        }
    }

    func animateHeaderLayout(direction: OneTapHeaderAnimationDirection, duration: Double = 0) {
        layoutIfNeeded()
        var pxAnimator = PXAnimator(duration: duration, dampingRatio: 1)
        pxAnimator.addAnimation(animation: { [weak self] in
            guard let self = self else { return }

            self.layoutIfNeeded()
            if direction == .horizontal {
                self.pinContentViewToTop()
            }
            for constraint in self.layout.getHorizontalContrainsts() {
                constraint.isActive = (direction == .horizontal)
            }

            for constraint in self.layout.getVerticalContrainsts() {
                constraint.isActive = (direction == .vertical)
            }
            self.imageView?.layer.cornerRadius = (direction == .vertical) ? self.layout.IMAGE_SIZE / 2 :  self.layout.IMAGE_NAV_SIZE / 2
            self.layoutIfNeeded()
        })

        pxAnimator.animate()
    }
}
