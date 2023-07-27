//
//  TokenizationService+Tracking.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 12/04/2019.
//

import Foundation

extension TokenizationService {
    internal func trackInvalidESC(error: MPSDKError, cardId: String, esc_length: Int?) {
        var properties: [String: Any] = [:]

        properties["path"] = TrackingPaths.Events.getCreateTokenPath()
        properties["style"] = Tracking.Style.noScreen
        properties["id"] = getErrorId(error: error)
        properties["attributable_to"] = Tracking.Error.Atrributable.mercadopago

        var extraDic: [String: Any] = [:]

        extraDic["api_error"] = error.getErrorForTracking()
        extraDic["card_id"] = cardId
        extraDic["esc_length"] = esc_length
        properties["extra_info"] = extraDic
        MPXTracker.sharedInstance.trackEvent(path: TrackingPaths.Events.getErrorPath(), properties: properties)
    }

    private func getErrorId(error: MPSDKError) -> String {

        if let apiException = error.apiException, apiException.containsCause(code: ApiUtil.ErrorCauseCodes.INVALID_ESC.rawValue) {
            return Tracking.Error.Id.invalidESC
        } else if let apiException = error.apiException, apiException.containsCause(code: ApiUtil.ErrorCauseCodes.INVALID_FINGERPRINT.rawValue) {
            return Tracking.Error.Id.invalidFingerprint
        }
        return ""
    }
}
