//
//  PXSummaryComponent.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 28/2/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

final class PXSummaryComponent: PXComponentizable {

    fileprivate var reusableView: UIView?

    var props: PXSummaryComponentProps {
        didSet {
            redrawRender()
        }
    }

    init(props: PXSummaryComponentProps) {
        self.props = props
    }

    public func render() -> UIView {
        guard let dequeueReusableView = reusableView else {
            return PXSummaryComponentRenderer().render(self)
        }
        return dequeueReusableView
    }
}

extension PXSummaryComponent {
    fileprivate func redrawRender() {
        reusableView = PXSummaryComponentRenderer().render(self)
    }
}
