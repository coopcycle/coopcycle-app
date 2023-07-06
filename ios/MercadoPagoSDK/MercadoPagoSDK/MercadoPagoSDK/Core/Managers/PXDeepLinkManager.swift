//
//  PXDeepLinkManager.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 9/23/19.
//

import Foundation

struct PXDeepLinkManager {

    static func open(_ deepLink: String?) {
        guard let targetUrl = deepLink else { return }
        let appShared = UIApplication.shared
        if let deepLinkUrl = URL(string: targetUrl), appShared.canOpenURL(deepLinkUrl) {
            appShared.open(deepLinkUrl, options: [:], completionHandler: { (success) in
                #if DEBUG
                    print("OpenDeeplink \(targetUrl): \(success)")
                #endif
            })
        }
    }
}
