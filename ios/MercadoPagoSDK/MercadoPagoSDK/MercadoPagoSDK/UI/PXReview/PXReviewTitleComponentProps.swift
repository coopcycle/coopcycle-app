//
//  PXReviewTitleComponentProps.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 3/3/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

final class PXReviewTitleComponentProps: NSObject {

    static let DEFAULT_TITLE: String = "Revisa si está todo bien"

    let reviewTitle: String
    let titleColor: UIColor
    let backgroundColor: UIColor

    init(withTitle: String?=nil, titleColor: UIColor, backgroundColor: UIColor) {

        if let customTitle = withTitle {
            self.reviewTitle = customTitle
        } else {
            self.reviewTitle = PXReviewTitleComponentProps.DEFAULT_TITLE.localized
        }

        self.titleColor = titleColor
        self.backgroundColor = backgroundColor
    }
}
