//
//  PXCreditsExpectationView.swift
//  MercadoPagoSDK
//
//  Created by Federico Bustos Fierro on 16/5/18.
//  Copyright © 2019 MercadoPago. All rights reserved.
//

import Foundation

final class PXCreditsExpectationView: UIView {

    let title: String
    let subtitle: String

    // Constants
    let TITLE_FONT_SIZE: CGFloat = PXLayout.XS_FONT
    let SUBTITLE_FONT_SIZE: CGFloat = PXLayout.XXS_FONT

    // Variables
    var titleLabel: UILabel?
    var subtitleLabel: UILabel?

    init(title: String, subtitle: String) {
        self.title = title
        self.subtitle = subtitle
        super.init(frame: .zero)
        render()
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

// MARK: Privates
private extension PXCreditsExpectationView {
    func render() {
        backgroundColor = .white
        translatesAutoresizingMaskIntoConstraints = false

        // Title
        let titleLabel = buildTitle()
        addSubview(titleLabel)
        NSLayoutConstraint.activate([
            titleLabel.topAnchor.constraint(equalTo: self.topAnchor),
            titleLabel.leadingAnchor.constraint(equalTo: self.leadingAnchor),
            titleLabel.trailingAnchor.constraint(equalTo: self.trailingAnchor)
        ])

        // Subtitle
        let subtitleLabel = buildSubtitle()
        addSubview(subtitleLabel)
        NSLayoutConstraint.activate([
            subtitleLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: PXLayout.XXXS_MARGIN),
            subtitleLabel.leadingAnchor.constraint(equalTo: self.leadingAnchor),
            subtitleLabel.trailingAnchor.constraint(equalTo: self.trailingAnchor),
            subtitleLabel.bottomAnchor.constraint(equalTo: self.bottomAnchor)
        ])
    }

    func buildTitle() -> UILabel {
        let label = UILabel()
        label.translatesAutoresizingMaskIntoConstraints = false
        titleLabel = label
        label.font = UIFont.ml_regularSystemFont(ofSize: TITLE_FONT_SIZE)
        label.text = title
        label.textColor = UIColor.black.withAlphaComponent(0.8)
        label.textAlignment = .left
        label.numberOfLines = 0
        return label
    }

    func buildSubtitle() -> UILabel {
        let label = UILabel()
        label.numberOfLines = 0
        label.translatesAutoresizingMaskIntoConstraints = false
        subtitleLabel = label
        label.font = UIFont.ml_regularSystemFont(ofSize: SUBTITLE_FONT_SIZE)
        label.text = subtitle
        label.textColor = UIColor.black.withAlphaComponent(0.45)
        label.textAlignment = .left
        return label
    }
}
