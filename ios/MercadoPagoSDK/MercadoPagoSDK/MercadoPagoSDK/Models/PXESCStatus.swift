//
//  PXESCStatus.swift
//  MercadoPagoSDKV4
//
//  Created by Eric Ertl on 30/01/2020.
//

import Foundation

public enum PXESCStatus: String {
    /**
     APPROVED - ESC status.
     */
    case APPROVED = "approved"
    /**
     REJECTED - ESC status.
     */
    case REJECTED = "rejected"
    /**
     NOT_EVALUATED - ESC status.
     */
    case NOT_EVALUATED = "not_evaluated"
}
