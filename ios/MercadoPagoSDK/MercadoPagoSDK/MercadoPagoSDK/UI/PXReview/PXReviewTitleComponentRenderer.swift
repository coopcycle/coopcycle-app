//
//  PXReviewTitleComponentRenderer.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 3/3/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

struct PXReviewTitleComponentRenderer {

    func render(_ titleComponent: PXReviewTitleComponent) -> UIView {
        return PXReviewTitleComponentView(withTitle: titleComponent.props.reviewTitle, titleColor: titleComponent.props.titleColor, backgroundColor: titleComponent.props.backgroundColor)
    }
}
