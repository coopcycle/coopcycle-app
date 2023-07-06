//
//  PXReviewTitleComponent.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 3/3/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

final class PXReviewTitleComponent: PXComponentizable {

    fileprivate var reusableView: UIView?

    var props: PXReviewTitleComponentProps {
        didSet {
            redrawRender()
        }
    }

    init(props: PXReviewTitleComponentProps) {
        self.props = props
    }

    public func render() -> UIView {
        guard let dequeueReusableView = reusableView else {
            return PXReviewTitleComponentRenderer().render(self)
        }
        return dequeueReusableView
    }
}

extension PXReviewTitleComponent {
    fileprivate func redrawRender() {
        reusableView = PXReviewTitleComponentRenderer().render(self)
    }
}
