//
//  PXFingerprint.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXFingerprint: NSObject, Codable {
    open var os: String?
    open var vendorIds: [PXDeviceId]?
    open var model: String?
    open var systemVersion: String?
    open var resolution: String?
    open var vendorSpecificAttributes: PXVendorSpecificAttributes?

    public override init () {
        super.init()
        deviceFingerprint()
    }

    public enum PXFingerprintKeys: String, CodingKey {
        case vendorSpecificAttributes = "vendor_specific_attributes"
        case vendorIds = "vendor_ids"
        case systemVersion = "system_version"
        case model
        case resolution
        case os
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXFingerprintKeys.self)
        try container.encodeIfPresent(self.vendorSpecificAttributes, forKey: .vendorSpecificAttributes)
        try container.encodeIfPresent(self.vendorIds, forKey: .vendorIds)
        try container.encodeIfPresent(self.systemVersion, forKey: .systemVersion)
        try container.encodeIfPresent(self.model, forKey: .model)
        try container.encodeIfPresent(self.resolution, forKey: .resolution)
        try container.encodeIfPresent(self.os, forKey: .os)
    }

    open func toJSONString() throws -> String? {
        let encoder = JSONEncoder()
        let data = try encoder.encode(self)
        return String(data: data, encoding: .utf8)
    }

    open func toJSON() throws -> Data {
        let encoder = JSONEncoder()
        return try encoder.encode(self)
    }

    open class func fromJSON(data: Data) throws -> PXFingerprint {
        return try JSONDecoder().decode(PXFingerprint.self, from: data)
    }

    open func deviceFingerprint() {
        let device: UIDevice = UIDevice.current

        self.os = "iOS"
        self.vendorIds = getDevicesIds()

        if !String.isNullOrEmpty(device.model) {
            self.model = device.model
        }

        if !String.isNullOrEmpty(device.systemVersion) {
            self.systemVersion = device.systemVersion
        }

        self.resolution = getDeviceResolution()
        self.vendorSpecificAttributes = PXVendorSpecificAttributes()
    }

    func getDevicesIds() -> [PXDeviceId]? {
        let systemVersionString: String = UIDevice.current.systemVersion
        let systemVersion: Float = (systemVersionString.components(separatedBy: ".")[0] as NSString).floatValue
        if systemVersion < 6 {
            let uuid: String = UUID().uuidString
            if !String.isNullOrEmpty(uuid) {
                let pxuuid = PXDeviceId(name: "uuid", value: uuid)
                return [pxuuid]
            }

        } else {
            let vendorId: String = UIDevice.current.identifierForVendor!.uuidString
            let uuid: String = UUID().uuidString

            let pxVendorId = PXDeviceId(name: "vendor_id", value: vendorId)
            let pxuuid = PXDeviceId(name: "uuid", value: uuid)

            return [pxVendorId, pxuuid]
        }
        return nil
    }

    func getDeviceResolution() -> String {
        let screenSize: CGRect = UIScreen.main.bounds
        let width = NSString(format: "%.0f", screenSize.width)
        let height = NSString(format: "%.0f", screenSize.height)
        return "\(width)x\(height)"
    }
}
