//
//  PXNewResultHeader.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 28/08/2019.
//

import UIKit

struct PXNewResultHeaderData {
    let color: UIColor?
    let title: String
    let icon: UIImage?
    let iconURL: String?
    let badgeImage: UIImage?
    let closeAction: (() -> Void)?
}

class PXNewResultHeader: UIView {

    let data: PXNewResultHeaderData

    init(data: PXNewResultHeaderData) {
        self.data = data
        super.init(frame: .zero)
        render()
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    //Image
    let IMAGE_WIDTH: CGFloat = 48.0
    let IMAGE_HEIGHT: CGFloat = 48.0

    //Badge Image
    let BADGE_IMAGE_SIZE: CGFloat = 16
    let BADGE_HORIZONTAL_OFFSET: CGFloat = -2.0
    let BADGE_VERTICAL_OFFSET: CGFloat = 0.0

    //Close Button
    let CLOSE_BUTTON_SIZE: CGFloat = 44

    //Text
    static let TITLE_FONT_SIZE: CGFloat = PXLayout.L_FONT

    var iconImageView: PXUIImageView?
    var badgeImageView: UIImageView?
    var closeButton: UIButton?
    var titleLabel: UILabel?

    func render() {
        removeAllSubviews()
        self.backgroundColor = data.color
        let pxContentView = UIView()
        pxContentView.backgroundColor = .clear
        pxContentView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(pxContentView)
        PXLayout.pinAllEdges(view: pxContentView, withMargin: PXLayout.ZERO_MARGIN)

        //Close button
        if let closeAction = data.closeAction {
            let button = buildCloseButton()
            closeButton = button
            pxContentView.addSubview(button)
            button.add(for: .touchUpInside, {
                closeAction()
            })
            PXLayout.pinTop(view: button, withMargin: PXLayout.M_MARGIN).isActive = true
            PXLayout.pinLeft(view: button, withMargin: PXLayout.S_MARGIN).isActive = true
        }

        //Title Label
        let titleLabel = buildTitleLabel(with: data.title)
        self.titleLabel = titleLabel
        pxContentView.addSubview(titleLabel)

        if let closeButton = self.closeButton {
            PXLayout.put(view: titleLabel, onBottomOf: closeButton, withMargin: PXLayout.M_MARGIN).isActive = true
        } else {
            PXLayout.pinTop(view: titleLabel, withMargin: PXLayout.M_MARGIN).isActive = true
        }

        PXLayout.pinBottom(view: titleLabel, withMargin: PXLayout.L_MARGIN).isActive = true
        PXLayout.pinLeft(view: titleLabel, withMargin: PXLayout.L_MARGIN).isActive = true

        //Icon ImageView
        if let imageURL = data.iconURL, imageURL.isNotEmpty {
            let pximage = PXUIImage(url: imageURL)
            iconImageView = buildCircleImage(with: pximage)
        } else {
            iconImageView = buildCircleImage(with: data.icon)
        }
        if let circleImage = iconImageView {
            pxContentView.addSubview(circleImage)
            PXLayout.centerVertically(view: circleImage, to: titleLabel).isActive = true
            PXLayout.pinRight(view: circleImage, withMargin: PXLayout.L_MARGIN).isActive = true

            //Title label layout
            PXLayout.put(view: titleLabel, leftOf: circleImage, withMargin: PXLayout.S_MARGIN).isActive = true

            //Badge Image
            let badgeImageView = UIImageView()
            self.badgeImageView = badgeImageView
            badgeImageView.image = data.badgeImage
            badgeImageView.translatesAutoresizingMaskIntoConstraints = false
            pxContentView.addSubview(badgeImageView)
            PXLayout.setWidth(owner: badgeImageView, width: BADGE_IMAGE_SIZE).isActive = true
            PXLayout.setHeight(owner: badgeImageView, height: BADGE_IMAGE_SIZE).isActive = true
            PXLayout.pinRight(view: badgeImageView, to: circleImage, withMargin: BADGE_HORIZONTAL_OFFSET).isActive = true
            PXLayout.pinBottom(view: badgeImageView, to: circleImage, withMargin: BADGE_VERTICAL_OFFSET).isActive = true
        } else {
            //Title label layout
            PXLayout.pinRight(view: titleLabel, withMargin: PXLayout.L_MARGIN).isActive = true
        }

        self.layoutIfNeeded()
    }

    func buildCloseButton() -> UIButton {
        let button = UIButton()
        button.translatesAutoresizingMaskIntoConstraints = false
        let image = ResourceManager.shared.getImage("result-close-button")
        let margin: CGFloat = 0
        button.contentEdgeInsets = UIEdgeInsets(top: margin, left: margin, bottom: margin, right: margin)
        button.setImage(image, for: .normal)
        button.accessibilityIdentifier = "result_close_button"
        PXLayout.setHeight(owner: button, height: CLOSE_BUTTON_SIZE).isActive = true
        PXLayout.setWidth(owner: button, width: CLOSE_BUTTON_SIZE).isActive = true
        return button
    }

    func buildCircleImage(with image: UIImage?) -> PXUIImageView {
        let circleImage = PXUIImageView(frame: CGRect(x: 0, y: 0, width: IMAGE_WIDTH, height: IMAGE_HEIGHT))
        circleImage.layer.masksToBounds = false
        circleImage.layer.cornerRadius = circleImage.frame.height / 2
        circleImage.layer.borderWidth = 1
        circleImage.layer.borderColor = UIColor.black.withAlphaComponent(0.1).cgColor
        circleImage.clipsToBounds = true
        circleImage.translatesAutoresizingMaskIntoConstraints = false
        circleImage.enableFadeIn()
        circleImage.contentMode = .scaleAspectFill
        circleImage.image = image
        circleImage.backgroundColor = .clear
        PXLayout.setHeight(owner: circleImage, height: IMAGE_WIDTH).isActive = true
        PXLayout.setWidth(owner: circleImage, width: IMAGE_HEIGHT).isActive = true
        return circleImage
    }

    func buildTitleLabel(with text: String) -> UILabel {
        let titleLabel = UILabel()
        titleLabel.font = UIFont.ml_semiboldSystemFont(ofSize: PXLayout.M_FONT)
        titleLabel.textAlignment = .left
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        titleLabel.text = text
        titleLabel.textColor = .white
        titleLabel.numberOfLines = 0
        titleLabel.lineBreakMode = .byWordWrapping
        titleLabel.lineBreakMode = .byTruncatingTail
        return titleLabel
    }
}
