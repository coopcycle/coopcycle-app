//
//  PXInstructionsAccreditationTimeComponent.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/16/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

class PXInstructionsAccreditationTimeComponent: NSObject, PXComponentizable {
    var props: PXInstructionsAccreditationTimeProps

    init(props: PXInstructionsAccreditationTimeProps) {
        self.props = props
    }

    public func getAccreditationCommentComponents() -> [PXInstructionsAccreditationCommentComponent] {
        var accreditationCommentComponents: [PXInstructionsAccreditationCommentComponent] = []
        if let comments = props.accreditationComments, !comments.isEmpty {
            for comment in comments {
                let accreditationCommentProps = PXInstructionsAccreditationCommentProps(accreditationComment: comment)
                let accreditationCommentComponent = PXInstructionsAccreditationCommentComponent(props: accreditationCommentProps)
                accreditationCommentComponents.append(accreditationCommentComponent)
            }
        }
        return accreditationCommentComponents
    }

    func render() -> UIView {
        return PXInstructionsAccreditationTimeRenderer().render(self)
    }
}
class PXInstructionsAccreditationTimeProps: NSObject {
    var accreditationMessage: String?
    var accreditationComments: [String]?
    init(accreditationMessage: String?, accreditationComments: [String]?) {
        self.accreditationMessage = accreditationMessage
        self.accreditationComments = accreditationComments
    }
}
