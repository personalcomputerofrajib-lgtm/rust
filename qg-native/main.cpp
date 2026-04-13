#include <windows.h>
#include <iostream>
#include <string>
#include <vector>
#include <psapi.h>
#include <iphlpapi.h>
#include <tcpestats.h>

#pragma comment(lib, "iphlpapi.lib")
#pragma comment(lib, "ws2_32.lib")

struct ProcessInfo {
    DWORD id;
    std::string name;
    SIZE_T memory_usage;
};

struct NetConn {
    std::string local;
    std::string remote;
    std::string state;
    DWORD pid;
};

void PrintProcessInfo(const ProcessInfo& info) {
    std::cout << "[PROC] {\"id\":" << info.id 
              << ", \"name\":\"" << info.name 
              << "\", \"memory\":" << info.memory_usage << "}" << std::endl;
}

void PrintNetConn(const NetConn& conn) {
    std::cout << "[NET] {\"local\":\"" << conn.local 
              << "\", \"remote\":\"" << conn.remote 
              << "\", \"state\":\"" << conn.state 
              << "\", \"pid\":" << conn.pid << "}" << std::endl;
}

void ScanNetwork() {
    PMIB_TCPTABLE_OWNER_PID pTcpTable;
    DWORD dwSize = 0;
    GetExtendedTcpTable(NULL, &dwSize, TRUE, AF_INET, TCP_TABLE_OWNER_PID_ALL, 0);
    pTcpTable = (MIB_TCPTABLE_OWNER_PID*)malloc(dwSize);

    if (GetExtendedTcpTable(pTcpTable, &dwSize, TRUE, AF_INET, TCP_TABLE_OWNER_PID_ALL, 0) == NO_ERROR) {
        for (DWORD i = 0; i < pTcpTable->dwNumEntries; i++) {
            NetConn conn;
            char localIp[16], remoteIp[16];
            struct in_addr localAddr, remoteAddr;
            
            localAddr.S_un.S_addr = pTcpTable->table[i].dwLocalAddr;
            remoteAddr.S_un.S_addr = pTcpTable->table[i].dwRemoteAddr;
            
            strcpy_s(localIp, inet_ntoa(localAddr));
            strcpy_s(remoteIp, inet_ntoa(remoteAddr));
            
            conn.local = std::string(localIp) + ":" + std::to_string(ntohs((u_short)pTcpTable->table[i].dwLocalPort));
            conn.remote = std::string(remoteIp) + ":" + std::to_string(ntohs((u_short)pTcpTable->table[i].dwRemotePort));
            conn.pid = pTcpTable->table[i].dwOwningPid;
            conn.state = "ESTABLISHED"; // Simplified for demo
            
            PrintNetConn(conn);
        }
    }
    free(pTcpTable);
}

void ScanProcesses() {
    // ... existing logic ...
    DWORD processes[1024], cbNeeded, cProcesses;
    if (!EnumProcesses(processes, sizeof(processes), &cbNeeded)) return;
    cProcesses = cbNeeded / sizeof(DWORD);

    for (unsigned int i = 0; i < cProcesses; i++) {
        if (processes[i] != 0) {
            TCHAR szProcessName[MAX_PATH] = TEXT("<unknown>");
            HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, FALSE, processes[i]);
            if (hProcess) {
                HMODULE hMod;
                DWORD cbNeededMod;
                if (EnumProcessModules(hProcess, &hMod, sizeof(hMod), &cbNeededMod)) {
                    GetModuleBaseName(hProcess, hMod, szProcessName, sizeof(szProcessName) / sizeof(TCHAR));
                }
                PROCESS_MEMORY_COUNTERS pmc;
                if (GetProcessMemoryInfo(hProcess, &pmc, sizeof(pmc))) {
                    ProcessInfo info = { processes[i], szProcessName, pmc.WorkingSetSize };
                    PrintProcessInfo(info);
                }
                CloseHandle(hProcess);
            }
        }
    }
}

int main() {
    std::cout << "[Native Bridge] Starting QuantumGuard Sentinel..." << std::endl;
    ScanProcesses();
    ScanNetwork();
    return 0;
}
