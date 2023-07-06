//
//  PXFooterComponent.swift
//  TestAutolayout
//
//  Created by Demian Tejo on 10/19/17.
//  Copyright © 2017 Demian Tejo. All rights reserved.
//

import UIKit

class PXFooterComponent: NSObject, PXComponentizable {
    var props: PXFooterProps

    init(props: PXFooterProps) {
        self.props = props
    }

    func render() -> UIView {
        return PXFooterRenderer().render(self)
    }

    func oneTapRender() -> UIView {
        return PXFooterRenderer().oneTapRender(self)
    }
}
