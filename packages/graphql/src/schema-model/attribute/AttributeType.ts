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

export enum GraphQLBuiltInScalarType {
    Int = "Int",
    Float = "Float",
    String = "String",
    Boolean = "Boolean",
    ID = "ID",
}

export enum Neo4jGraphQLSpatialType {
    CartesianPoint = "CartesianPoint",
    Point = "Point",
}

export enum Neo4jGraphQLNumberType {
    BigInt = "BigInt",
}

export enum Neo4jGraphQLTemporalType {
    DateTime = "DateTime",
    LocalDateTime = "LocalDateTime",
    Time = "Time",
    LocalTime = "LocalTime",
    Date = "Date",
    Duration = "Duration",
}

export type Neo4jGraphQLScalarType = Neo4jGraphQLTemporalType | Neo4jGraphQLNumberType;

// The ScalarType class is not used to represent user defined scalar types, see UserScalarType for that.
export class ScalarType {
    public readonly name: GraphQLBuiltInScalarType | Neo4jGraphQLScalarType;
    public readonly isRequired: boolean;
    constructor(name: GraphQLBuiltInScalarType | Neo4jGraphQLScalarType, isRequired: boolean) {
        this.name = name;
        this.isRequired = isRequired;
    }
}

export class Neo4jCartesianPointType {
    public readonly name: string;
    public readonly isRequired: boolean;
    constructor(isRequired: boolean) {
        this.name = Neo4jGraphQLSpatialType.CartesianPoint;
        this.isRequired = isRequired;
    }
}

export class Neo4jPointType {
    public readonly name: string;
    public readonly isRequired: boolean;
    constructor(isRequired: boolean) {
        this.name = Neo4jGraphQLSpatialType.Point;
        this.isRequired = isRequired;
    }
}

export class UserScalarType {
    public readonly name: string;
    public readonly isRequired: boolean;
    constructor(name: string, isRequired: boolean) {
        this.name = name;
        this.isRequired = isRequired;
    }
}

export class ObjectType {
    public readonly name: string;
    public readonly isRequired: boolean;
    // TODO: add fields

    constructor(name: string, isRequired: boolean) {
        this.name = name;
        this.isRequired = isRequired;
    }
}

// TODO: consider replacing this with a isList field on the other classes
export class ListType {
    public readonly name: string;
    public readonly ofType: Exclude<AttributeType, ListType>;
    public readonly isRequired: boolean;
    constructor(ofType: AttributeType, isRequired: boolean) {
        this.name = `List<${ofType.name}>`;
        this.ofType = ofType;
        this.isRequired = isRequired;
    }
}

export class EnumType {
    public readonly name: string;
    public readonly isRequired: boolean;
    // TODO: add enum values

    constructor(name: string, isRequired: boolean) {
        this.name = name;
        this.isRequired = isRequired;
    }
}

export class UnionType {
    public readonly name: string;
    public readonly isRequired: boolean;
    // TODO: add implementing types
    constructor(name: string, isRequired: boolean) {
        this.name = name;
        this.isRequired = isRequired;
    }
}

export class InterfaceType {
    public readonly name: string;
    public readonly isRequired: boolean;
    // TODO: add shared fields

    constructor(name: string, isRequired: boolean) {
        this.name = name;
        this.isRequired = isRequired;
    }
}

export class InputType {
    public readonly name: string;
    public readonly isRequired: boolean;

    constructor(name: string, isRequired: boolean) {
        this.name = name;
        this.isRequired = isRequired;
    }
}

export class UnknownType {
    public readonly name: string;
    public readonly isRequired: boolean;

    constructor(name: string, isRequired: boolean) {
        this.name = name;
        this.isRequired = isRequired;
    }
}

export type AttributeType =
    | ScalarType
    | UserScalarType
    | ObjectType
    | ListType
    | EnumType
    | UnionType
    | InterfaceType
    | InputType
    | UnknownType;
