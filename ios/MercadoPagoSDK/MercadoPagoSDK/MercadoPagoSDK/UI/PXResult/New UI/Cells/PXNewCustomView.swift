//
//  PXNewCustomView.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 29/08/2019.
//

import UIKit

open class PXNewCustomViewData {
    let firstString: NSAttributedString?
    let secondString: NSAttributedString?
    let thirdString: NSAttributedString?
    let icon: UIImage?
    let iconURL: String?
    let action: PXAction?
    let color: UIColor?

    init(firstString: NSAttributedString?, secondString: NSAttributedString?, thirdString: NSAttributedString?, icon: UIImage?, iconURL: String?, action: PXAction?, color: UIColor?) {
        self.firstString = firstString
        self.secondString = secondString
        self.thirdString = thirdString
        self.icon = icon
        self.iconURL = iconURL
        self.action = action
        self.color = color
    }
}

class PXNewCustomView: UIView {

    //Row Settings
    let ROW_HEIGHT: CGFloat = 80

    //Icon
    let IMAGE_WIDTH: CGFloat = 48.0
    let IMAGE_HEIGHT: CGFloat = 48.0

    var iconView: UIView?

    let data: PXNewCustomViewData

    class func getData() -> PXNewCustomViewData {
        return PXNewCustomViewData(firstString: nil, secondString: nil, thirdString: nil, icon: nil, iconURL: nil, action: nil, color: nil)
    }

    init(data: PXNewCustomViewData, bottomView: UIView? = nil) {
        self.data = data
        super.init(frame: .zero)
        render(with: bottomView)
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    //Attributes
    static let titleAttributes: [NSAttributedString.Key: Any] = [
        NSAttributedString.Key.font: UIFont.ml_semiboldSystemFont(ofSize: PXLayout.XS_FONT),
        NSAttributedString.Key.foregroundColor: UIColor.black.withAlphaComponent(0.8)
    ]

    static let subtitleAttributes: [NSAttributedString.Key: Any] = [
        NSAttributedString.Key.font: UIFont.ml_regularSystemFont(ofSize: PXLayout.XXS_FONT),
        NSAttributedString.Key.foregroundColor: UIColor.black.withAlphaComponent(0.45)
    ]

    func render(with bottomView: UIView?) {
        removeAllSubviews()
        let pxContentView = UIView()
        pxContentView.backgroundColor = .clear
        addSubview(pxContentView)
        PXLayout.pinAllEdges(view: pxContentView, withMargin: PXLayout.ZERO_MARGIN)
        PXLayout.setHeight(owner: pxContentView, height: ROW_HEIGHT, relation: .greaterThanOrEqual).isActive = true

        //Background Color
        if let color = data.color {
            self.backgroundColor = color
        }

        // Icon
        if let imageURL = data.iconURL, imageURL.isNotEmpty {
            let pximage = PXUIImage(url: imageURL)
            iconView = buildCircleImage(with: pximage)
        } else {
            iconView = buildCircleImage(with: data.icon)
        }

        let labelsView = PXComponentView()
        labelsView.clipsToBounds = true
        pxContentView.addSubview(labelsView)

        if let circleImage = iconView {
            pxContentView.addSubview(circleImage)
            PXLayout.pinTop(view: circleImage, withMargin: PXLayout.S_MARGIN)
            PXLayout.pinLeft(view: circleImage, withMargin: PXLayout.L_MARGIN)

            // Put labels view next to the icon
            PXLayout.put(view: labelsView, rightOf: circleImage, withMargin: PXLayout.S_MARGIN)
        } else {
            // Pin labels view next to the left
            PXLayout.pinLeft(view: labelsView, withMargin: PXLayout.L_MARGIN)
        }
        PXLayout.pinRight(view: labelsView, withMargin: PXLayout.L_MARGIN)
        PXLayout.pinTop(view: labelsView, withMargin: PXLayout.S_MARGIN)

        // First Label
        if let firstString = data.firstString {
            let label = buildLabel(firstString)
            labelsView.addSubviewToBottom(label)
            PXLayout.pinLeft(view: label)
            PXLayout.pinRight(view: label)
        }

        // Second Label
        if let secondString = data.secondString {
            let label = buildLabel(secondString)
            labelsView.addSubviewToBottom(label, withMargin: PXLayout.XXXS_MARGIN)
            PXLayout.pinLeft(view: label)
            PXLayout.pinRight(view: label)
        }

        // Third Label
        if let thirdString = data.thirdString {
            let label = buildLabel(thirdString)
            labelsView.addSubviewToBottom(label, withMargin: PXLayout.XXXS_MARGIN)
            PXLayout.pinLeft(view: label)
            PXLayout.pinRight(view: label)
        }

        //Action Label
        if let action = data.action {
            let button = buildButton(action)
            labelsView.addSubviewToBottom(button, withMargin: PXLayout.XXXS_MARGIN)
            PXLayout.setHeight(owner: button, height: 20)
            PXLayout.pinLeft(view: button)
            PXLayout.pinRight(view: button)
        }

        labelsView.pinLastSubviewToBottom()

        if let expectationView = bottomView {
            pxContentView.addSubview(expectationView)
            NSLayoutConstraint.activate([
                expectationView.leadingAnchor.constraint(equalTo: pxContentView.leadingAnchor, constant: PXLayout.L_MARGIN),
                expectationView.trailingAnchor.constraint(equalTo: pxContentView.trailingAnchor, constant: -PXLayout.L_MARGIN)
            ])

            if let iconView = iconView {
                expectationView.topAnchor.constraint(equalTo: iconView.bottomAnchor, constant: PXLayout.S_MARGIN).isActive = true
            } else {
                expectationView.topAnchor.constraint(equalTo: labelsView.bottomAnchor, constant: PXLayout.S_MARGIN).isActive = true
            }

        }
        PXLayout.pinLastSubviewToBottom(view: pxContentView, withMargin: PXLayout.S_MARGIN)
    }

    @objc func actionTapped() {
        guard let action = data.action else {
            return
        }
        action.action()
    }
}

// MARK: UI Builders
extension PXNewCustomView {
    func buildCircleImage(with image: UIImage?) -> UIView {
        let RADIUS_DELTA_FROM_ICON_TO_BACKGROUND: CGFloat = 58

        let iconView = UIView()
        iconView.translatesAutoresizingMaskIntoConstraints = false
        iconView.backgroundColor = .white
        iconView.layer.cornerRadius = IMAGE_HEIGHT/2
        iconView.layer.masksToBounds = true
        iconView.layer.borderWidth = 1
        iconView.layer.borderColor = UIColor.black.withAlphaComponent(0.08).cgColor
        PXLayout.setHeight(owner: iconView, height: IMAGE_HEIGHT)
        PXLayout.setWidth(owner: iconView, width: IMAGE_WIDTH)

        let imageView = PXUIImageView()
        imageView.translatesAutoresizingMaskIntoConstraints = false
        imageView.image = image
        imageView.clipsToBounds = true
        imageView.enableFadeIn()
        imageView.contentMode = .scaleAspectFill
        iconView.addSubview(imageView)

        PXLayout.matchWidth(ofView: imageView, withPercentage: RADIUS_DELTA_FROM_ICON_TO_BACKGROUND).isActive = true
        PXLayout.matchHeight(ofView: imageView, withPercentage: RADIUS_DELTA_FROM_ICON_TO_BACKGROUND).isActive = true
        PXLayout.centerVertically(view: imageView).isActive = true
        PXLayout.centerHorizontally(view: imageView).isActive = true

        return iconView
    }

    func buildLabel(_ string: NSAttributedString) -> UILabel {
        let label = UILabel()
        label.attributedText = string
        label.lineBreakMode = .byWordWrapping
        label.numberOfLines = 2
        return label
    }

    func buildButton(_ action: PXAction) -> UIButton {
        let button = UIButton()
        button.translatesAutoresizingMaskIntoConstraints = false
        button.contentHorizontalAlignment = .left
        button.setTitle(action.label, for: .normal)
        button.titleLabel?.font = Utils.getFont(size: PXLayout.XXS_FONT)
        button.setTitleColor(ThemeManager.shared.secondaryColor(), for: .normal)
        button.add(for: .touchUpInside, action.action)
        return button
    }
}
