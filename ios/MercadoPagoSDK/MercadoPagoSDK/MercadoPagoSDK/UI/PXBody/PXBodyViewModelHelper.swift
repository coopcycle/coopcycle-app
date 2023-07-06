//
//  PXBodyViewModelHelper.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/27/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

internal extension PXResultViewModel {
    func getBodyComponentProps() -> PXBodyProps {
        let props = PXBodyProps(paymentResult: self.paymentResult, amountHelper: self.amountHelper, instruction: getInstrucion(), callback: getBodyAction())
        return props
    }

    func buildBodyComponent() -> PXComponentizable? {
        let bodyProps = getBodyComponentProps()
        return PXBodyComponent(props: bodyProps)
    }
}

// MARK: Build Helpers
internal extension PXResultViewModel {
    func getBodyAction() -> (() -> Void) {
        return { [weak self]  in self?.executeBodyCallback() }
    }

    func executeBodyCallback() {
        if let callback = self.callback {
            callback(PaymentResult.CongratsState.call_FOR_AUTH)
        }
    }

    func getInstrucion() -> PXInstruction? {
        guard let instructionsInfo = self.instructionsInfo else {
            return nil
        }
        return instructionsInfo.getInstruction()
    }
}
