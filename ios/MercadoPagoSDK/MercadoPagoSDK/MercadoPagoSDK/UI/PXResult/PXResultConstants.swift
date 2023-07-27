//
//  PXResultConstants.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 1/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

// MARK: Header Constants
struct PXHeaderResutlConstants {
    // Header titles
    static let APPROVED_HEADER_TITLE = "¡Listo! Se acreditó tu pago"
    static let PENDING_HEADER_TITLE = "Estamos procesando el pago"
    static let REJECTED_HEADER_TITLE = "rejected_default_title"

    // Icon subtext
    static let REJECTED_ICON_SUBTEXT = "review_and_confirm_toast_error"
}

// MARK: Footer Constants
struct PXFooterResultConstants {
    // Button texts
    static let GENERIC_ERROR_BUTTON_TEXT = "Pagar con otro medio"
    static let C4AUTH_BUTTON_TEXT = "cc_rejected_call_for_authorize_button"
    static let CARD_DISABLE_BUTTON_TEXT = "cc_rejected_card_disabled_button"
    static let DUPLICATED_PAYMENT_BUTTON_TEXT = "cc_rejected_duplicated_payment_button"
    static let BAD_FILLED_BUTTON_TEXT = "cc_rejected_bad_filled_button"
    static let FRAUD_BUTTON_TEXT = "Continuar"
    static let DEFAULT_BUTTON_TEXT: String? = nil

    // Link texts
    static let APPROVED_LINK_TEXT = "Continuar"
    static let ERROR_LINK_TEXT = "Cancelar pago"
    static let C4AUTH_LINK_TEXT = "Cancelar pago"
    static let WARNING_LINK_TEXT = "Pagar con otro medio"
    static let DEFAULT_LINK_TEXT = "Continuar"
}
