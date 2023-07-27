//
//  PXTrackingConfiguration.swift
//  MercadoPagoSDKV4
//
//  Created by Federico Bustos Fierro on 27/05/2019.
//

import UIKit

@objcMembers
open class PXTrackingConfiguration: NSObject {
    let trackListener: PXTrackerListener?
    let flowName: String?
    let flowDetails: [String: Any]?
    let sessionId: String?

    public init(trackListener: PXTrackerListener? = nil,
                flowName: String? = nil,
                flowDetails: [String: Any]? = nil,
                sessionId: String?) {
        self.trackListener = trackListener
        self.flowName = flowName
        self.flowDetails = flowDetails
        self.sessionId = sessionId
    }

    internal func updateTracker() {
        //TODO: replace PXTracker internally with a better solution based on this class
        if let trackListener = trackListener {
            MPXTracker.sharedInstance.setTrack(listener: trackListener)
            MPXTracker.sharedInstance.setFlowName(name: flowName)
            MPXTracker.sharedInstance.setFlowDetails(flowDetails: flowDetails)
        }
        if let sessionId = sessionId {
            MPXTracker.sharedInstance.setCustomSessionId(sessionId)
        }
    }
}
