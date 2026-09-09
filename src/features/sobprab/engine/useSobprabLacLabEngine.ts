import { useCallback, useMemo, useReducer } from "react";
import {
  calcBCGScore,
  calcField,
  getFabricColor,
  getInitialSobprabState,
  sobprabReducer,
} from "./SobprabLacLabEngine";

export function useSobprabLacLabEngine() {
  const [state, dispatch] = useReducer(sobprabReducer, undefined, getInitialSobprabState);

  const field = useMemo(
    () => calcField(state.hostTree, state.season, state.temperature, state.biocontrol),
    [state.hostTree, state.season, state.temperature, state.biocontrol],
  );

  const fabric = useMemo(
    () => getFabricColor(state.pH, state.mordant),
    [state.pH, state.mordant],
  );

  const bcg = useMemo(
    () => calcBCGScore(field, state.biocontrol, state.pH),
    [field, state.biocontrol, state.pH],
  );

  const actions = {
    setHostTree: useCallback((value: typeof state.hostTree) => dispatch({ type: "set_host_tree", value }), []),
    setSeason: useCallback((value: typeof state.season) => dispatch({ type: "set_season", value }), []),
    setTemperature: useCallback((value: number) => dispatch({ type: "set_temperature", value }), []),
    setBiocontrol: useCallback((value: number) => dispatch({ type: "set_biocontrol", value }), []),
    setPH: useCallback((value: number) => dispatch({ type: "set_ph", value }), []),
    setMordant: useCallback((value: typeof state.mordant) => dispatch({ type: "set_mordant", value }), []),
    setProcessRunning: useCallback((value: boolean) => dispatch({ type: "set_process_running", value }), []),
    reset: useCallback(() => dispatch({ type: "reset" }), []),
  };

  return { state, field, fabric, bcg, actions };
}
