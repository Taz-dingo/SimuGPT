// 状态类型
export type State = {
    displayNavigation: boolean;
    themeMode: "dark" | "light";
    currentModel: string;
};
// 根据type字段决定要进行甚麽操作
export enum ActionType {
    UPDATE = "UPDATE",
}
// 更新操作类型
type UpdateAction = {
    type: ActionType.UPDATE;   // type固定为update
    field: string,      // 属性名
    value: any          // 属性值
}
// 所有操作组合在一起，作为对外统一的参数类型 
export type Action = UpdateAction;

/* ---------------------------------------------------- */

// 默认状态值
export const initState: State = {
    displayNavigation: true,
    themeMode: "light",
    currentModel: "gpt-3.5-turbo",
}
// 1. 创建reducer函数。接收状态、操作，返回新的状态
export function reducer(state: State, action: Action) {
    switch (action.type) {
        case ActionType.UPDATE: // Update操作，更新状态（传入对应属性名更新为传入属性值）
            return { ...state, [action.field]: action.value };
        // 其他情况抛出错误
        default: throw new Error();
    }
}