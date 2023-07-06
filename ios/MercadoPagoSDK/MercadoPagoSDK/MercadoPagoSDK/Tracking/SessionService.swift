//
//  SessionService.swift
//  MercadoPagoPXTracking
//
//  Created by Juan sebastian Sanzone on 9/3/18.
//  Copyright © 2018 Mercado Pago. All rights reserved.
//

import Foundation

final internal class SessionService {

    static let SESSION_ID_KEY: String = "session_id"
    private var sessionId: String

    init(_ currentSessionId: String = SessionService.getUUID()) {
        sessionId = currentSessionId
    }

    func getSessionId() -> String {
        return sessionId
    }

    func getRequestId() -> String {
        return SessionService.getUUID()
    }

    func startNewSession() {
        sessionId = SessionService.getUUID()
    }

    func startNewSession(externalSessionId: String) {
        sessionId = externalSessionId
    }
}

// MARK: - Internal functions.
internal extension SessionService {
    static func getUUID() -> String {
        return UUID().uuidString.lowercased()
    }
}
