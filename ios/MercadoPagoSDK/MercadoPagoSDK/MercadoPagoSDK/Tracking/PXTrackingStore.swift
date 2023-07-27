//
//  PXTrackingStore.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 3/13/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

internal final class PXTrackingStore {
    enum TrackingChoType: String {
        case one_tap
        case traditional
    }

    static let sharedInstance = PXTrackingStore()
    static let cardIdsESC = "CARD_IDS_ESC"
    private var data = [String: Any]()
    private var initDate: Date = Date()
    private var trackingChoType: TrackingChoType?

    public func addData(forKey: String, value: Any) {
        self.data[forKey] = value
    }

    public func remove(key: String) {
        data.removeValue(forKey: key)
    }

    public func removeAll() {
        data.removeAll()
    }

    public func getData(forKey: String) -> Any? {
        return self.data[forKey]
    }
}

// MARK: Screen time support methods.
extension PXTrackingStore {
    func initializeInitDate() {
        initDate = Date()
    }

    func getSecondsAfterInit() -> Int {
        guard let seconds = Calendar.current.dateComponents([Calendar.Component.second], from: initDate, to: Date()).second else { return 0 }
        return seconds
    }
}

// MARK: Tracking cho type.
extension PXTrackingStore {
    func getChoType() -> String? {
        return trackingChoType?.rawValue
    }

    func setChoType(_ type: TrackingChoType) {
        trackingChoType = type
    }

    func cleanChoType() {
        trackingChoType = nil
    }
}
