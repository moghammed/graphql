"use strict";
/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNeo4jDatabaseInfo = exports.Neo4jDatabaseInfo = void 0;
const semver = __importStar(require("semver"));
const constants_1 = require("../constants");
class Neo4jDatabaseInfo {
    constructor(version, edition) {
        this.version = this.toSemVer(version);
        this.rawVersion = version;
        this.edition = edition;
    }
    toSemVer(version) {
        const coerced = semver.coerce(version);
        if (!semver.valid(coerced)) {
            throw new Error(`Could not coerce provided version ${version}`);
        }
        return coerced;
    }
    toString() {
        return this.rawVersion;
    }
    eq(version) {
        return semver.eq(this.version, this.toSemVer(version));
    }
    gt(version) {
        return semver.gt(this.version, this.toSemVer(version));
    }
    gte(version) {
        return semver.gte(this.version, this.toSemVer(version));
    }
    lt(version) {
        return semver.lt(this.version, this.toSemVer(version));
    }
    lte(version) {
        return semver.lt(this.version, this.toSemVer(version));
    }
}
exports.Neo4jDatabaseInfo = Neo4jDatabaseInfo;
async function getNeo4jDatabaseInfo(executor) {
    const { records } = await executor.execute(constants_1.DBMS_COMPONENTS_QUERY, {}, "READ");
    const rawRow = records[0];
    const [rawVersion, edition] = rawRow;
    return new Neo4jDatabaseInfo(rawVersion, edition);
}
exports.getNeo4jDatabaseInfo = getNeo4jDatabaseInfo;
//# sourceMappingURL=Neo4jDatabaseInfo.js.map