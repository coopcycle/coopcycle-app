//
//  HtmlStorage.swift
//  MercadoPagoSDK
//
//  Created by Esteban Adrian Boffa on 16/07/2019.
//

import Foundation

struct HtmlStorageObject {
    let id: Int
    let html: String
}

class HtmlStorage {
    private var htmlStorage: [HtmlStorageObject] = [HtmlStorageObject]()
    let baseUrl: String = "pxHtml://"
    static let shared = HtmlStorage()

    func set(_ targetHtml: String) -> String {
        let targetId = htmlStorage.count + 1
        let element = HtmlStorageObject(id: targetId, html: targetHtml)
        htmlStorage.append(element)
        return "\(baseUrl)\(targetId)"
    }

    func getHtml(_ url: String) -> String? {
        let targetIdStr = url.replacingOccurrences(of: baseUrl, with: "")
        if let targetId = Int(targetIdStr) {
            let htmlFound = htmlStorage.filter { (storage: HtmlStorageObject) -> Bool in
                return storage.id == targetId
            }
            if let founded = htmlFound.first {
                return founded.html
            }
        }
        return nil
    }

    func clean() {
        htmlStorage.removeAll()
    }
}
