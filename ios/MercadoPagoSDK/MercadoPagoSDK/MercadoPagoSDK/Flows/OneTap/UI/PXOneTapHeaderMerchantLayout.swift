//
//  PXOneTapHeaderMerchantLayout.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 3/23/19.
//

import Foundation

struct PXOneTapHeaderMerchantLayout {
    enum LayoutType {
        case onlyTitle
        case titleSubtitle
    }

    private let layoutType: LayoutType
    private var horizontalLayoutConstraints: [NSLayoutConstraint] = []
    private var verticalLayoutConstraints: [NSLayoutConstraint] = []

    internal let IMAGE_NAV_SIZE: CGFloat = 40
    internal var IMAGE_SIZE: CGFloat {
        if UIDevice.isSmallDevice() {
            return IMAGE_NAV_SIZE
        } else if UIDevice.isLargeDevice() || UIDevice.isExtraLargeDevice() {
            return 65
        } else {
            return 55
        }
    }

    init(layoutType: PXOneTapHeaderMerchantLayout.LayoutType) {
        self.layoutType = layoutType
    }
}

// MARK: Factory make factory.
extension PXOneTapHeaderMerchantLayout {
    mutating func makeConstraints(_ containerView: UIView, _ imageContainerView: UIView, _ titleLabel: UILabel, _ subTitleLabel: UILabel? = nil) {
        // horizontalLayoutConstraints es un set de constraints para mostrar la imagen del merchant, titulo y subtitulo
        // de manera horizontal, sobre la navigationBar para ocupar menos espacio
        horizontalLayoutConstraints.removeAll()
        var horizontalConstraints = [PXLayout.pinBottom(view: containerView),
                                     PXLayout.pinLeft(view: containerView, withMargin: PXLayout.XL_MARGIN),
                                     PXLayout.pinTop(view: imageContainerView, withMargin: PXLayout.XXS_MARGIN),
                                     PXLayout.pinBottom(view: imageContainerView, withMargin: PXLayout.XXS_MARGIN),
                                     PXLayout.pinLeft(view: imageContainerView, withMargin: PXLayout.XXS_MARGIN),
                                     PXLayout.pinRight(view: titleLabel, withMargin: PXLayout.XXS_MARGIN),
                                     PXLayout.put(view: imageContainerView, leftOf: titleLabel, withMargin: PXLayout.XXS_MARGIN, relation: .equal),
                                     PXLayout.setHeight(owner: imageContainerView, height: IMAGE_NAV_SIZE),
                                     PXLayout.setWidth(owner: imageContainerView, width: IMAGE_NAV_SIZE)]
        if let subTitleLabel = subTitleLabel {
            horizontalConstraints.append(contentsOf: [PXLayout.pinBottom(view: subTitleLabel, to: imageContainerView, withMargin: 0),
                                                      PXLayout.put(view: subTitleLabel, onBottomOf: titleLabel),
                                                      PXLayout.pinLeft(view: subTitleLabel, to: titleLabel, withMargin: 0),
                                                      PXLayout.pinTop(view: titleLabel, to: imageContainerView, withMargin: 0)])
        } else {
            horizontalConstraints.append(PXLayout.centerVertically(view: imageContainerView, to: titleLabel))
        }
        horizontalLayoutConstraints.append(contentsOf: horizontalConstraints)

        // verticalLayoutConstraints es un set de constraints para mostrar la imagen del merchant, titulo y subtitulo
        // de manera vertical cuando hay mas epacio de pantalla disponible
        verticalLayoutConstraints.removeAll()
        var verticalConstraints = [PXLayout.pinBottom(view: containerView),
                                   PXLayout.centerHorizontally(view: containerView),
                                   PXLayout.centerHorizontally(view: imageContainerView),
                                   PXLayout.pinTop(view: imageContainerView, withMargin: PXLayout.XXS_MARGIN),
                                   PXLayout.centerHorizontally(view: titleLabel),
                                   PXLayout.put(view: titleLabel, onBottomOf: imageContainerView, withMargin: PXLayout.XXS_MARGIN),
                                   PXLayout.setHeight(owner: imageContainerView, height: IMAGE_SIZE),
                                   PXLayout.setWidth(owner: imageContainerView, width: IMAGE_SIZE),
                                   PXLayout.matchWidth(ofView: containerView)]
        if let subTitleLabel = subTitleLabel {
            verticalConstraints.append(contentsOf: [PXLayout.centerHorizontally(view: subTitleLabel),
                                                    PXLayout.put(view: subTitleLabel, onBottomOf: titleLabel, withMargin: PXLayout.XXXS_MARGIN),
                                                    PXLayout.pinBottom(view: subTitleLabel, withMargin: PXLayout.XXS_MARGIN)])
        } else {
            verticalConstraints.append(contentsOf: [PXLayout.pinBottom(view: titleLabel, withMargin: PXLayout.XXS_MARGIN),
                                                    PXLayout.pinLeft(view: titleLabel, withMargin: PXLayout.L_MARGIN),
                                                    PXLayout.pinRight(view: titleLabel, withMargin: PXLayout.L_MARGIN)])
        }
        verticalLayoutConstraints.append(contentsOf: verticalConstraints)
    }
}

// MARK: Publics
extension PXOneTapHeaderMerchantLayout {
    func getLayoutType() -> LayoutType {
        return layoutType
    }

    func getHorizontalContrainsts() -> [NSLayoutConstraint] {
        return horizontalLayoutConstraints
    }

    func getVerticalContrainsts() -> [NSLayoutConstraint] {
        return verticalLayoutConstraints
    }
}
