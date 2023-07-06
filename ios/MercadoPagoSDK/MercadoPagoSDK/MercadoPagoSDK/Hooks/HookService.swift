//
//  HookService.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 31/7/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

final class HookService {
    private var hooks: [PXHookComponent] = [PXHookComponent]()
    private var hooksToShow: [PXHookComponent] = [PXHookComponent]()
}

extension HookService {
    func addHookToFlow(hook: PXHookComponent) -> Bool {
        let matchedHooksForStep = self.hooksToShow.filter { targetHook in
            targetHook.hookForStep() == hook.hookForStep()
        }
        if matchedHooksForStep.isEmpty {
            self.hooks.append(hook)
            self.hooksToShow.append(hook)
        }
        return matchedHooksForStep.isEmpty
    }

    func getHookForStep(hookStep: PXHookStep) -> PXHookComponent? {
        let matchedHooksForStep = self.hooksToShow.filter { targetHook in
            targetHook.hookForStep() == hookStep
        }
        return matchedHooksForStep.first
    }

    func removeHookFromHooksToShow(hookStep: PXHookStep) {
        let noMatchedHooksForStep = self.hooksToShow.filter { targetHook in
            targetHook.hookForStep() != hookStep
        }
        hooksToShow = noMatchedHooksForStep
    }

    func addHookToHooksToShow(hookStep: PXHookStep) {
        let matchedHooksForStep = self.hooks.filter { targetHook in
            targetHook.hookForStep() == hookStep
        }

        for hook in matchedHooksForStep {
            hooksToShow.append(hook)
        }
    }

    func resetHooksToShow() {
        hooksToShow = hooks
    }

    func removeHooks() {
        hooks = []
        hooksToShow = []
    }
}
