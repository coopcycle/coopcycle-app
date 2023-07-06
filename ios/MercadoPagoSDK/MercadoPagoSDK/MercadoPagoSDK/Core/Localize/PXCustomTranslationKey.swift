//
//  PXCustomTranslationKey.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 5/28/19.
//

import Foundation

/// :nodoc
@objc public enum PXCustomTranslationKey: Int {
    case total_to_pay
    case total_to_pay_onetap
    case how_to_pay
    case pay_button
    case pay_button_progress

    internal var getValue: String {
        switch self {
        case .total_to_pay, .total_to_pay_onetap: return "total_row_title_default"
        case .how_to_pay: return "¿Cómo quieres pagar?"
        case .pay_button: return "Pagar"
        case .pay_button_progress: return "Procesando tu pago"
        }
    }
}
