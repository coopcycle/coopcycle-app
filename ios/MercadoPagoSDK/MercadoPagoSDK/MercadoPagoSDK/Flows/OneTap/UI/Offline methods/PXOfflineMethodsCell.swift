//
//  PXOfflineMethodsCell.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 18/12/2019.
//

import Foundation

internal typealias PXOfflineMethodsCellData = (title: PXText?, subtitle: PXText?, image: UIImage?, isSelected: Bool)

final class PXOfflineMethodsCell: UITableViewCell {
    static let identifier = "PXOfflineMethodsCell"

    //Selection Indicator
    let INDICATOR_IMAGE_SIZE: CGFloat = 16.0

    //Icon
    let ICON_SIZE: CGFloat = 48.0

    func render(data: PXOfflineMethodsCellData) {
        contentView.removeAllSubviews()
        selectionStyle = .none
        backgroundColor = .white

        let indicatorImage = ResourceManager.shared.getImage(data.isSelected ? "indicator_selected" : "indicator_unselected")
        let indicatorImageView = UIImageView(image: indicatorImage)
        indicatorImageView.translatesAutoresizingMaskIntoConstraints = false

        contentView.addSubview(indicatorImageView)
        NSLayoutConstraint.activate([
            indicatorImageView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: PXLayout.S_MARGIN),
            indicatorImageView.centerYAnchor.constraint(equalTo: contentView.centerYAnchor),
            indicatorImageView.heightAnchor.constraint(equalToConstant: INDICATOR_IMAGE_SIZE),
            indicatorImageView.widthAnchor.constraint(equalToConstant: INDICATOR_IMAGE_SIZE)
        ])

        let iconImageView = buildCircleImage(with: data.image)
        contentView.addSubview(iconImageView)

        NSLayoutConstraint.activate([
            iconImageView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 44),
            iconImageView.centerYAnchor.constraint(equalTo: contentView.centerYAnchor)
        ])

        let labelsContainerView = UIStackView()
        labelsContainerView.translatesAutoresizingMaskIntoConstraints = false
        labelsContainerView.axis = .vertical

        if let title = data.title {
            let titleLabel = UILabel()
            titleLabel.translatesAutoresizingMaskIntoConstraints = false
            titleLabel.attributedText = title.getAttributedString(fontSize: PXLayout.XS_FONT)
            labelsContainerView.addArrangedSubview(titleLabel)
        }

        if let subtitle = data.subtitle {
            let subtitleLabel = UILabel()
            subtitleLabel.translatesAutoresizingMaskIntoConstraints = false
            subtitleLabel.attributedText = subtitle.getAttributedString(fontSize: PXLayout.XXS_FONT)
            labelsContainerView.addArrangedSubview(subtitleLabel)
        }

        contentView.addSubview(labelsContainerView)
        NSLayoutConstraint.activate([
            labelsContainerView.leadingAnchor.constraint(equalTo: iconImageView.trailingAnchor, constant: PXLayout.XS_MARGIN),
            labelsContainerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -PXLayout.XXS_MARGIN),
            labelsContainerView.centerYAnchor.constraint(equalTo: contentView.centerYAnchor),
            labelsContainerView.heightAnchor.constraint(equalToConstant: 40)
        ])
    }

    func buildCircleImage(with image: UIImage?) -> PXUIImageView {
        let circleImage = PXUIImageView(frame: CGRect(x: 0, y: 0, width: ICON_SIZE, height: ICON_SIZE))
        circleImage.layer.masksToBounds = false
        circleImage.layer.cornerRadius = circleImage.frame.height / 2
        circleImage.layer.borderWidth = 1
        circleImage.layer.borderColor = UIColor.black.withAlphaComponent(0.1).cgColor
        circleImage.clipsToBounds = true
        circleImage.translatesAutoresizingMaskIntoConstraints = false
        circleImage.enableFadeIn()
        circleImage.contentMode = .scaleAspectFit
        circleImage.image = image
        circleImage.backgroundColor = .clear
        PXLayout.setHeight(owner: circleImage, height: ICON_SIZE).isActive = true
        PXLayout.setWidth(owner: circleImage, width: ICON_SIZE).isActive = true
        return circleImage
    }

}
